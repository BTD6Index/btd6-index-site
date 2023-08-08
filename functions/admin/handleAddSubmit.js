async function handleAddSubmit({context, challenge, fields, extraInfoFields}) {
    const db = context.env.BTD6_INDEX_DB;

    const redirectError = (error) => {
        return Response.redirect(
            new URL(`/admin/add-${challenge}-result?` + new URLSearchParams([['error', error]]), context.request.url), 302);
    };

    if (context.request.method !== "POST") {
        return redirectError(`Request method should be POST, got ${context.request.method}`);
    }

    let form_data = await context.request.formData();

    for (let key of fields.concat(form_data.has('og') ? extraInfoFields : [])) {
        if (!form_data.has(key)) {
            return redirectError(`Missing required key: ${key}`);
        }
    }
    
    if (!form_data.has('person')) {
        return redirectError(`Missing required key: person`);
    }

    if (!form_data.has('link') && !form_data.has('image')) {
        return redirectError('Need one of link or image keys');
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

    const all_fields_placeholder = Array.from({length: fields.length + 3}, (_dummy, idx) => `?${idx+1}`).join(',');
    const info_fields_placeholder = Array.from({length: extraInfoFields.length}, (_dummy, idx) => `?${idx+1}`).join(',');
    const fields_condition = fields.map((field, idx) => `${field} = ?${idx+1}`).join(' AND ');
    const add_completion_stmt = `INSERT OR IGNORE INTO "${challenge}_completions" (${fields.join(',')},person,link,og) SELECT ${all_fields_placeholder} `
    + `WHERE NOT EXISTS (SELECT * FROM "${challenge}_completions" WHERE ${fields_condition}) RETURNING *`;
    const add_info_stmt = `INSERT OR ROLLBACK INTO "${challenge}_extra_info" VALUES (${info_fields_placeholder})`;

    let batch = [
        db.prepare(add_completion_stmt)
        .bind(...fields.map(field => form_data.get(field)), form_data.get('person'), link, form_data.has('og') ? 1 : 0)
    ];
    if (form_data.has('og')) {
        batch.push(db.prepare(add_info_stmt).bind(...extraInfoFields.map(field => form_data.get(field))));
    }

    let batch_result = await db.batch(batch);
    let inserted = batch_result[0].results.length > 0;

    if (inserted && hasImage) {
        // upload only when uuid doesn't exist
        let r2Obj = await context.env.BTD6_INDEX_MEDIA.put(
            key, form_data.get('image').stream(), {onlyIf: {etagDoesNotMatch: '*'}}
        );
        if (r2Obj === null) {
            return redirectError('Failed to upload object');
        }
    }

    return Response.redirect(new URL(`/admin/add-${challenge}-result?inserted=${inserted}`, context.request.url), 302);
}

export { handleAddSubmit };