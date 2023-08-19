async function handleDeleteSubmit({context, challenge, fields, joinFields}) {
    const db = context.env.BTD6_INDEX_DB;
    const media = context.env.BTD6_INDEX_MEDIA;
    const jwt_result = context.data.jwt_result;
    const is_helper = jwt_result.payload.permissions.includes('write:admin');

    const respondError = (error) => {
        return Response.json({error}, {status: 400});
    };

    if (context.request.method !== "POST") {
        return respondError(`Request method should be POST, got ${context.request.method}`);
    }

    let form_data = await context.request.formData();
    if (!form_data.has('entries')) {
        return respondError(`Need ${challenge} entries to delete passed in`);
    }

    const delete_completion_condition = fields.map((field, idx) => `cmp.${field} = json_extract(value, '$[${idx}]')`).join(' AND ');
    const delete_info_condition = joinFields.map(field => `ext.${field} = cmp.${field}`).join(' AND ')
    const select_og_completion_stmt = `SELECT 1 FROM "${challenge}_completions" AS cmp INNER JOIN json_each(?1) ON ${delete_completion_condition} AND cmp.og = 1`;
    const delete_info_stmt = `DELETE FROM "${challenge}_extra_info" AS ext WHERE EXISTS (${select_og_completion_stmt} WHERE ${delete_info_condition})`;
    const delete_completion_stmt = `DELETE FROM "${challenge}_completions" AS cmp WHERE EXISTS (SELECT 1 FROM json_each(?1) `
    + `WHERE ${delete_completion_condition} AND ${is_helper ? '?2 = ?2' : 'pending = ?2'})`;
    const delete_notes_stmt = `DELETE FROM "${challenge}_completion_notes" AS cmp WHERE EXISTS (SELECT 1 FROM json_each(?1) `
    + `WHERE ${delete_completion_condition})`;
    const delete_filekey_stmt = `DELETE FROM "${challenge}_filekeys" AS cmp WHERE EXISTS (SELECT 1 FROM json_each(?1) `
    + `WHERE ${delete_completion_condition}) RETURNING filekey`;
    
    let res = await db.batch([
        db.prepare(delete_info_stmt).bind(
            form_data.get('entries')
            ),
        db.prepare(delete_completion_stmt).bind(
            form_data.get('entries'),
            jwt_result.payload.sub
            ),
        db.prepare(delete_notes_stmt).bind(
            form_data.get('entries')
            ),
        db.prepare(delete_filekey_stmt).bind(
            form_data.get('entries')
            )
    ]);

    for (let row of res[3].results) {
        context.waitUntil(
            media.list({prefix: row.filekey})
            .then(async (listRes) => {
                await media.delete(listRes.objects.map(obj => obj.key));
            })
        );
    }

    return Response.json({});
}

export { handleDeleteSubmit };