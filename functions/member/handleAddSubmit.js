function expandSQLArray(paramNo, arrayLen) {
    let buf = [];
    for (let i = 0; i < arrayLen; ++i) {
        buf.push(`json_extract(?${paramNo}, '$[${i}]')`);
    }
    return buf.join(',');
}

function sqlArrayCondition(paramNo, fields) {
    return fields.map((field, i) => `${field} = json_extract(?${paramNo}, '$[${i}]')`).join(' AND ');
}

async function handleAddSubmit({ context, challenge, fields, extraInfoFields, genEmbedFunction }) {
    const db = context.env.BTD6_INDEX_DB;
    const media = context.env.BTD6_INDEX_MEDIA;
    const jwt_result = context.data.jwt_result;
    const is_helper = jwt_result.payload.permissions.includes('write:admin');

    const webhookUrls = typeof context.env.WEBHOOKS === 'string' ? JSON.parse(context.env.WEBHOOKS) : (context.env.WEBHOOKS ?? []);

    const respondError = (error) => {
        return Response.json({ error }, { status: 400 });
    };

    if (context.request.method !== "POST") {
        return respondError(`Request method should be POST, got ${context.request.method}`);
    }

    let form_data = await context.request.formData();

    const edit_mode = ['true', '1'].includes(form_data.get('edit'));

    for (let key of fields.concat(form_data.has('og') ? extraInfoFields : [])) {
        if (!form_data.has(key)) {
            return respondError(`Missing required key: ${key}`);
        }
    }

    if (!form_data.has('person')) {
        return respondError(`Missing required key: person`);
    }

    if (!form_data.has('link') && !form_data.has('image')) {
        return respondError('Need one of link or image keys');
    }

    let link = null;
    let imageKey = crypto.randomUUID();

    const hasImage = form_data.has('image') && form_data.get('image') instanceof File;

    if (!hasImage) {
        link = form_data.get('link') || null;
    }

    const shared_fields = fields.filter(field => extraInfoFields.includes(field));

    const delete_completion_statement = `DELETE FROM "${challenge}_completions" WHERE ${sqlArrayCondition(1, fields)} `
        + `AND ${is_helper ? `?2 = ?2` : `pending = ?2`} RETURNING *`;
    const delete_info_stmt = `DELETE FROM "${challenge}_extra_info" WHERE ${sqlArrayCondition(1, shared_fields)}`;
    const delete_notes_stmt = `DELETE FROM "${challenge}_completion_notes" WHERE ${sqlArrayCondition(1, fields)}`;
    const update_filekeys_stmt = `UPDATE "${challenge}_filekeys" SET (${fields.join(',')}) = (${expandSQLArray(1, fields.length)}) `
    + `WHERE ${sqlArrayCondition(2, fields)} RETURNING filekey`;
    const insert_filekeys_stmt = `INSERT INTO "${challenge}_filekeys" VALUES (${expandSQLArray(1, fields.length)}, ?2)`;
    const add_completion_stmt = `INSERT INTO "${challenge}_completions" VALUES (${expandSQLArray(1, fields.length)}, ?2, ?3, ?4, ?5)`;
    const add_info_stmt = `INSERT INTO "${challenge}_extra_info" VALUES (${expandSQLArray(1, extraInfoFields.length)})`;
    const add_notes_stmt = `INSERT INTO "${challenge}_completion_notes" VALUES (${expandSQLArray(1, fields.length)}, ?2)`;

    let update_filekeys_idx = -1;
    let batched_stmts = [];
    if (edit_mode) {
        batched_stmts.push(db.prepare(delete_completion_statement).bind(
            JSON.stringify(fields.map(field => form_data.get(`edited-${field}`))),
            jwt_result.payload.sub // user id
        ));
        if (form_data.has('og')) {
            batched_stmts.push(db.prepare(delete_info_stmt).bind(
                JSON.stringify(shared_fields.map(field => form_data.get(`edited-${field}`)))
            ));
        }
        if (form_data.has('notes')) {
            batched_stmts.push(db.prepare(delete_notes_stmt).bind(
                JSON.stringify(fields.map(field => form_data.get(`edited-${field}`)))
            ));
        }
        update_filekeys_idx = batched_stmts.length;
        batched_stmts.push(db.prepare(update_filekeys_stmt).bind(
            JSON.stringify(fields.map(field => form_data.get(`${field}`))),
            JSON.stringify(fields.map(field => form_data.get(`edited-${field}`)))
        ));
    } else {
        batched_stmts.push(db.prepare(insert_filekeys_stmt).bind(
            JSON.stringify(fields.map(field => form_data.get(`${field}`))),
            imageKey
        ));
    }

    batched_stmts.push(db.prepare(add_completion_stmt)
        .bind(
            JSON.stringify(fields.map(field => form_data.get(field))),
            form_data.get('person'),
            link,
            form_data.has('og') ? 1 : 0,
            form_data.has('verify') && is_helper ? null : jwt_result.payload.sub, // user id
        ));

    if (form_data.has('og')) {
        batched_stmts.push(
            db.prepare(add_info_stmt)
                .bind(
                    JSON.stringify(extraInfoFields.map(field => form_data.get(field)))
                )
        );
    }
    if (form_data.has('notes')) {
        batched_stmts.push(
            db.prepare(add_notes_stmt)
                .bind(
                    JSON.stringify(fields.map(field => form_data.get(field))),
                    form_data.get('notes')
                )
        );
    }

    let batch_result;
    try {
        batch_result = await db.batch(batched_stmts);
    } catch (e) {
        return respondError(e.message);
    }

    if (edit_mode) {
        imageKey = batch_result[update_filekeys_idx].results[0].filekey;

        if (link) {
            // delete image if replaced with link
            context.waitUntil(media.delete(imageKey));
        }
    }

    if (hasImage) {
        // in add mode, upload only when uuid doesn't exist
        let r2Obj = await media.put(
            imageKey, form_data.get('image').stream(), edit_mode ? {} : { onlyIf: { etagDoesNotMatch: '*' } }
        );
        if (r2Obj === null) {
            return respondError('Failed to upload image object');
        }
    }

    for (let attachment of form_data.getAll('attachments')) {
        if (attachment instanceof File) {
            let r2Obj = await media.put(
                `${imageKey}/attach/${crypto.randomUUID()}`,
                attachment.stream(), { onlyIf: { etagDoesNotMatch: '*' } }
            );
            if (r2Obj === null) {
                return respondError('Failed to upload an attachment');
            }
        }
    }
    
    context.waitUntil(media.delete(
        form_data
        .getAll('delete-attachments')
        .filter(key => key.startsWith(`${imageKey}/attach`)) // for security reasons
        ));

    for (let webhookUrl of webhookUrls) {
        context.waitUntil(
            media.list({prefix: `${imageKey}/attach`}).then(async (listRes) => {
                await fetch(webhookUrl, {
                    body: JSON.stringify(genEmbedFunction({
                        link, formData: form_data, edit: edit_mode, filekey: imageKey,
                        attachmentKeys: listRes.objects.map(object => object.key),
                        verify: form_data.has('verify') && is_helper
                    })),
                    method: "post",
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
            })
        );
    }

    return Response.json({ inserted: true });
}

export { handleAddSubmit };