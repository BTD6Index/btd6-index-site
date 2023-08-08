async function handleDeleteSubmit({context, challenge, fields, joinFields}) {
    const db = context.env.BTD6_INDEX_DB;

    const redirectError = (error) => {
        return Response.redirect(
            new URL(`/admin/delete-${challenge}-result?` + new URLSearchParams([['error', error]]), context.request.url), 302);
    };

    if (context.request.method !== "POST") {
        return redirectError(`Request method should be POST, got ${context.request.method}`);
    }

    let form_data = await context.request.formData();
    if (!form_data.has('entries')) {
        return redirectError(`Need ${challenge} entries to delete passed in`);
    }

    const delete_completion_condition = fields.map((field, idx) => `cmp.${field} = json_extract(value, '$[${idx}]')`).join(' AND ');
    const delete_info_condition = joinFields.map(field => `ext.${field} = cmp.${field}`).join(' AND ')
    const select_og_completion_stmt = `SELECT 1 FROM "${challenge}_completions" AS cmp INNER JOIN json_each(?1) ON ${delete_completion_condition} AND cmp.og = 1`;
    const delete_info_stmt = `DELETE FROM "${challenge}_extra_info" AS ext WHERE EXISTS (${select_og_completion_stmt} WHERE ${delete_info_condition})`;
    const delete_completion_stmt = `DELETE FROM "${challenge}_completions" AS cmp WHERE EXISTS (SELECT 1 FROM json_each(?1) WHERE ${delete_completion_condition})`;
    
    await db.batch([
        db.prepare(delete_info_stmt).bind(form_data.get('entries')),
        db.prepare(delete_completion_stmt).bind(form_data.get('entries'))
    ]);

    return Response.redirect(new URL(`/admin/delete-${challenge}-result`, context.request.url), 302);
}

export { handleDeleteSubmit };