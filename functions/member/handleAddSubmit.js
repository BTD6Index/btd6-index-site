import { imageObjectRegex } from "../imageObjectRegex";

function fieldsCondition(fields, startIdx) {
    return fields.map((field, idx) => `${field} = ?${idx + startIdx}`).join(' AND ');
}

function paramsList(startIdx, endIdx) {
    let buf = []
    for (let i = startIdx; i < endIdx; ++i) {
        buf.push(`?${i + 1}`);
    }
    return buf.join(',');
}

async function handleAddSubmit({ context, challenge, fields, extraInfoFields, genEmbedFunction }) {
    const db = context.env.BTD6_INDEX_DB;
    const jwt_result = context.data.jwt_result;
    const is_helper = jwt_result.payload['https://btd6index.win/roles'].includes('Index Helper');

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

    let link;
    let key;

    const hasImage = form_data.has('image') && form_data.get('image') instanceof File;

    if (hasImage) {
        key = crypto.randomUUID();
        link = `https://media.btd6index.win/${key}`;
    } else {
        link = form_data.get('link');
    }

    const shared_fields = fields.filter(field => extraInfoFields.includes(field));

    const delete_completion_statement = `DELETE FROM "${challenge}_completions" WHERE ${fieldsCondition(fields, 1)} `
        + `AND ${is_helper ? `?${fields.length + 1} = ?${fields.length + 1}` : `pending = ?${fields.length + 1}`} RETURNING *`;
    const delete_info_stmt = `DELETE FROM "${challenge}_extra_info" WHERE ${fieldsCondition(shared_fields, 1)}`;
    const delete_notes_stmt = `DELETE FROM "${challenge}_completion_notes" WHERE ${fieldsCondition(fields, 1)}`;
    const add_completion_stmt = `INSERT INTO "${challenge}_completions" (${fields.join(',')},person,link,og,pending) VALUES (${paramsList(0, fields.length + 4)})`;
    const add_info_stmt = `INSERT INTO "${challenge}_extra_info" VALUES (${paramsList(0, extraInfoFields.length)})`;
    const add_notes_stmt = `INSERT INTO "${challenge}_completion_notes" VALUES (${paramsList(0, fields.length + 1)})`;

    let batched_stmts = [];
    if (edit_mode) {
        batched_stmts.push(db.prepare(delete_completion_statement).bind(
            ...fields.map(field => form_data.get(`edited-${field}`)),
            jwt_result.payload.sub // user id
        ));
        if (form_data.has('og')) {
            batched_stmts.push(db.prepare(delete_info_stmt).bind(
                ...shared_fields.map(field => form_data.get(`edited-${field}`))
            ));
        }
        if (form_data.has('notes')) {
            batched_stmts.push(db.prepare(delete_notes_stmt).bind(
                ...fields.map(field => form_data.get(`edited-${field}`))
            ));
        }
    }

    batched_stmts.push(db.prepare(add_completion_stmt)
        .bind(
            ...fields.map(field => form_data.get(field)),
            form_data.get('person'),
            link,
            form_data.has('og') ? 1 : 0,
            form_data.has('verify') && is_helper ? null : jwt_result.payload.sub, // user id
        ));

    if (form_data.has('og')) {
        batched_stmts.push(
            db.prepare(add_info_stmt)
                .bind(
                    ...extraInfoFields.map(field => form_data.get(field))
                )
        );
    }
    if (form_data.has('notes')) {
        batched_stmts.push(
            db.prepare(add_notes_stmt)
                .bind(
                    ...fields.map(field => form_data.get(field)),
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
        for (let row of res[0].results) {
            let link = row?.['link'];
    
            if (link) {
                // attempt to delete old image object if applicable
                let match = imageObjectRegex.exec(link);
                if (match) {
                    context.waitUntil(context.env.BTD6_INDEX_MEDIA.delete(match[1]));
                }
            }
        }
    }

    if (hasImage) {
        // upload only when uuid doesn't exist
        let r2Obj = await context.env.BTD6_INDEX_MEDIA.put(
            key, form_data.get('image').stream(), { onlyIf: { etagDoesNotMatch: '*' } }
        );
        if (r2Obj === null) {
            return respondError('Failed to upload image object');
        }
    }

    for (let webhookUrl of webhookUrls) {
        context.waitUntil(fetch(webhookUrl, {
            body: JSON.stringify(genEmbedFunction({ link, formData: form_data, edit: edit_mode })),
            method: "post",
            headers: {
                "Content-Type": "application/json"
            }
        }));
    }

    return Response.json({ inserted: true });
}

export { handleAddSubmit };