function redirectError(error) {
    return Response.redirect(
        new URL('/admin/delete-2tc-result?' + new URLSearchParams([['error', error]]), context.request.url), 302);
}

export async function onRequest(context) {
    if (context.request.method !== "POST") {
        return redirectError(`Request method should be POST, got ${context.request.method}`);
    }

    let form_data = await context.request.formData();
    if (!form_data.has('entries')) {
        return redirectError('Need 2tc entries to delete passed in');
    }

    await context.env.BTD6_INDEX_DB
    .prepare('DELETE FROM "2tc_completions" WHERE EXISTS (SELECT 1 FROM json_each(?1) WHERE '
    + 'tower1 = json_extract(value, \'$[0]\') AND tower2 = json_extract(value, \'$[1]\') AND map = json_extract(value, \'$[2]\'))')
    .bind(form_data.get('entries'))
    .run();

    return Response.redirect(new URL('/admin/delete-2tc-result', context.request.url), 302);
}