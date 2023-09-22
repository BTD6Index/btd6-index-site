import sanitizeDiscord from "../sanitizeDiscord";

function expandSQLArray(paramNo, arrayLen) {
    let buf = [];
    for (let i = 0; i < arrayLen; ++i) {
        buf.push(`json_extract(?${paramNo}, '$[${i}]')`);
    }
    return buf.join(',');
}

function sqlArrayCondition(paramNo, fields, altFieldIndexOrder = null) {
    return fields.map(
        (field, i) => `${field} = json_extract(?${paramNo}, '$[${altFieldIndexOrder ? altFieldIndexOrder[i] : i}]')`
    ).join(' AND ');
}

function getWebhookUrls(context, verify) {
    const webhookVar = context.env[verify ? 'WEBHOOKS' : 'WEBHOOKS_PENDING'];
    const webhookUrls = typeof webhookVar === 'string' ? JSON.parse(webhookVar) : (webhookVar ?? []);
    return webhookUrls;
}

async function processImages({imageKey, editMode, formData, media, context, link, hasImage}) {
    if (editMode) {
        if (link) {
            // delete image if replaced with link
            context.waitUntil(media.delete(imageKey));
        }
    }

    if (hasImage) {
        // in add mode, upload only when uuid doesn't exist
        let r2Obj = await media.put(
            imageKey, formData.get('image').stream(), editMode ? {} : { onlyIf: { etagDoesNotMatch: '*' } }
        );
        if (r2Obj === null) {
            throw new Error('Failed to upload image object');
        }
    }

    for (let attachment of formData.getAll('attachments')) {
        if (attachment instanceof File) {
            let r2Obj = await media.put(
                `${imageKey}/attach/${crypto.randomUUID()}`,
                attachment.stream(), { onlyIf: { etagDoesNotMatch: '*' } }
            );
            if (r2Obj === null) {
                throw new Error('Failed to upload an attachment');
            }
        }
    }

    context.waitUntil(media.delete(
        formData
        .getAll('delete-attachments')
        .filter(key => key.startsWith(`${imageKey}/attach`)) // for security reasons
    ));
}

async function handleAddSubmit({
    context,
    challenge,
    fields,
    extraInfoFields,
    genEmbedFunction,
    auxFields = ['person']
}) {
    const db = context.env.BTD6_INDEX_DB;
    const media = context.env.BTD6_INDEX_MEDIA;
    const jwtResult = context.data.jwtResult;
    const isHelper = jwtResult.payload.permissions.includes('write:admin');

    const respondError = (error) => {
        return Response.json({ error }, { status: 400 });
    };

    let formData = await context.request.formData();

    const verify = formData.has('verify') && isHelper;
    const webhookUrls = getWebhookUrls(context, verify);

    const editMode = ['true', '1'].includes(formData.get('edit'));

    for (let key of fields.concat(formData.has('og') ? extraInfoFields : [])) {
        if (!formData.has(key)) {
            return respondError(`Missing required key: ${key}`);
        }
    }

    for (let key of auxFields) {
        if (!formData.has(key)) {
            return respondError(`Missing required key: ${key}`);
        }
    }

    if (!formData.has('link') && !formData.has('image')) {
        return respondError('Need one of link or image keys');
    }

    let link = null;
    let imageKey = crypto.randomUUID();

    const hasImage = formData.has('image') && formData.get('image') instanceof File;

    if (!hasImage) {
        link = formData.get('link') || null;
    }

    const shared_fields = fields.filter(field => extraInfoFields.includes(field));

    const delete_completion_statement = `DELETE FROM "${challenge}_completions" WHERE ${sqlArrayCondition(1, fields)} `
        + `AND ${isHelper ? `?2 = ?2` : `pending = ?2`} RETURNING *`;
    const delete_info_stmt = `DELETE FROM "${challenge}_extra_info" WHERE ${sqlArrayCondition(1, shared_fields)}`;
    const delete_notes_stmt = `DELETE FROM "${challenge}_completion_notes" WHERE ${sqlArrayCondition(1, fields)}`;
    const update_filekeys_stmt = `UPDATE "${challenge}_filekeys" SET (${fields.join(',')}) = (${expandSQLArray(1, fields.length)}) `
    + `WHERE ${sqlArrayCondition(2, fields)} RETURNING filekey`;
    const insert_filekeys_stmt = `INSERT INTO "${challenge}_filekeys" VALUES (${expandSQLArray(1, fields.length)}, ?2)`;
    const add_completion_stmt = `INSERT INTO "${challenge}_completions" VALUES `
    + `(${expandSQLArray(1, fields.length)}, ${expandSQLArray(2, auxFields.length)}, ?3, ?4, ?5)`;
    const add_info_stmt = `INSERT INTO "${challenge}_extra_info" VALUES (${expandSQLArray(1, extraInfoFields.length)})`;
    const add_notes_stmt = `INSERT INTO "${challenge}_completion_notes" VALUES (${expandSQLArray(1, fields.length)}, ?2)`;

    let update_filekeys_idx = -1;
    let batched_stmts = [];
    if (editMode) {
        batched_stmts.push(db.prepare(delete_completion_statement).bind(
            JSON.stringify(fields.map(field => formData.get(`edited-${field}`))),
            jwtResult.payload.sub // user id
        ));
        if (formData.has('og')) {
            batched_stmts.push(db.prepare(delete_info_stmt).bind(
                JSON.stringify(shared_fields.map(field => formData.get(`edited-${field}`)))
            ));
        }
        if (formData.has('notes')) {
            batched_stmts.push(db.prepare(delete_notes_stmt).bind(
                JSON.stringify(fields.map(field => formData.get(`edited-${field}`)))
            ));
        }
        update_filekeys_idx = batched_stmts.length;
        batched_stmts.push(db.prepare(update_filekeys_stmt).bind(
            JSON.stringify(fields.map(field => formData.get(`${field}`))),
            JSON.stringify(fields.map(field => formData.get(`edited-${field}`)))
        ));
    } else {
        batched_stmts.push(db.prepare(insert_filekeys_stmt).bind(
            JSON.stringify(fields.map(field => formData.get(`${field}`))),
            imageKey
        ));
    }

    batched_stmts.push(db.prepare(add_completion_stmt)
        .bind(
            JSON.stringify(fields.map(field => formData.get(field))),
            JSON.stringify(auxFields.map(field => formData.get(field))),
            link,
            formData.has('og') ? 1 : 0,
            verify ? null : jwtResult.payload.sub, // user id
        ));

    if (formData.has('og')) {
        batched_stmts.push(
            db.prepare(add_info_stmt)
                .bind(
                    JSON.stringify(extraInfoFields.map(field => formData.get(field)))
                )
        );
    }
    if (formData.has('notes')) {
        batched_stmts.push(
            db.prepare(add_notes_stmt)
                .bind(
                    JSON.stringify(fields.map(field => formData.get(field))),
                    formData.get('notes')
                )
        );
    }

    let batch_result;
    try {
        batch_result = await db.batch(batched_stmts);

        if (editMode) {
            imageKey = batch_result[update_filekeys_idx].results[0].filekey;
        }
    
        await processImages({imageKey, context, editMode: editMode, formData: formData, media, link, hasImage});
    } catch (e) {
        return respondError(e.message);
    }

    for (let webhookUrl of webhookUrls) {
        context.waitUntil(
            media.list({prefix: `${imageKey}/attach`}).then(async (listRes) => {
                await fetch(webhookUrl, {
                    body: JSON.stringify(genEmbedFunction({
                        link,
                        formData: formData,
                        edit: editMode,
                        filekey: imageKey,
                        attachmentKeys: listRes.objects.map(object => object.key),
                        verify
                    })),
                    method: "post",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
            })
        );
    }

    return Response.json({ inserted: true });
}

async function handleAddSubmitLCCLike({context, challenge}) {
    const db = context.env.BTD6_INDEX_DB;
    const media = context.env.BTD6_INDEX_MEDIA;
    const jwtResult = context.data.jwtResult;
    const isHelper = jwtResult.payload.permissions.includes('write:admin');

    const respondError = (error) => {
        return Response.json({ error }, { status: 400 });
    };

    let formData = await context.request.formData();

    const verify = formData.has('verify') && isHelper;
    const webhookUrls = getWebhookUrls(context, verify);

    const editMode = ['true', '1'].includes(formData.get('edit'));

    const fieldKeys = ['map', 'money', 'person', 'version', 'date', 'notes'];
    const requiredFieldKeys = [...fieldKeys];
    for (let key of requiredFieldKeys) {
        if (!formData.has(key)) {
            return respondError(`Missing required key: ${key}`);
        }
    }
    const fieldValues = fieldKeys.map(field => formData.get(field));

    if (!formData.has('link') && !formData.has('image')) {
        return respondError('Need one of link or image keys');
    }

    let link = null;
    let imageKey = crypto.randomUUID();

    const hasImage = formData.has('image') && formData.get('image') instanceof File;

    if (!hasImage) {
        link = formData.get('link') || null;
    }

    let query;
    if (editMode) {
        query = db.prepare(`
            UPDATE "${challenge}_completions" SET (${fieldKeys.join(',')}, link, pending) = (${expandSQLArray(1, fieldKeys.length)}, ?2, ?3)
            WHERE filekey = ?4 AND ${isHelper ? 'TRUE' : 'pending = ?3'} RETURNING filekey
        `).bind(
            JSON.stringify(fieldValues),
            link,
            verify ? null : jwtResult.payload.sub,
            formData.get('edited-filekey')
        );
    } else {
        query = db.prepare(`
            INSERT INTO "${challenge}_completions" (${fieldKeys.join(',')}, link, pending, filekey)
            VALUES (${expandSQLArray(1, fieldKeys.length)}, ?2, ?3, ?4) RETURNING filekey
        `).bind(
            JSON.stringify(fieldValues),
            link,
            verify ? null : jwtResult.payload.sub,
            imageKey
        );
    }

    try {
        imageKey = (await query.first()).filekey;

        await processImages({imageKey, context, editMode, formData, media, link, hasImage});
    } catch (e) {
        return respondError(e.message);
    }
    
    for (let webhookUrl of webhookUrls) {
        context.waitUntil(
            media.list({prefix: `${imageKey}/attach`}).then(async (listRes) => {
                await fetch(webhookUrl, {
                    body: JSON.stringify({
                        "content": `**${formData.get('map')} ${challenge.toUpperCase()} ($${formData.get('money')}) on Version ${formData.get('version')} ${
                            editMode ? 'Edited' : 'Submitted'
                        }${verify ? ' and Verified' : ''}**\n`
                        + `Person: ${sanitizeDiscord(formData.get('person'))}\n`
                        + `Link: ${sanitizeDiscord(link || `https://media.btd6index.win/${imageKey}`)}\n`
                        + `Notes and Attachments: https://btd6index.win/${challenge}/notes?${new URLSearchParams({
                            filekey: imageKey
                        })}`,
                        "username": "Glue Rat",
                        "avatar_url": "https://btd6index.win/GlueGunnerPetRatIcon.png",
                        "attachments": []
                    }),
                    method: "post",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
            })
        );
    }

    return Response.json({ inserted: true });
}

export { handleAddSubmit, handleAddSubmitLCCLike, processImages, getWebhookUrls };