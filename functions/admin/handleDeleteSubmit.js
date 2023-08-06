async function handleDeleteSubmit({context, challenge, fields}) {
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
    
    await context.env.BTD6_INDEX_DB
    .prepare(`DELETE FROM "${challenge}_completions" WHERE EXISTS (SELECT 1 FROM json_each(?1) WHERE `
    + fields.map((field, idx) => `${field} = json_extract(value, '$[${idx}]')`).join(' AND ') + ')')
    .bind(form_data.get('entries'))
    .run();

    return Response.redirect(new URL(`/admin/delete-${challenge}-result`, context.request.url), 302);
}

export { handleDeleteSubmit };