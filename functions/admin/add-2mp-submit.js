function redirectError(error) {
    return Response.redirect(
        new URL('/admin/add-2mp-result?' + new URLSearchParams([['error', error]]), context.request.url), 302);
}

export async function onRequest(context) {
    if (context.request.method !== "POST") {
        return redirectError(`Request method should be POST, got ${context.request.method}`);
    }

    let form_data = await context.request.formData();

    for (let key of ['entity', 'map', 'person']) {
        if (!form_data.has(key)) {
            return redirectError(`Missing required key: ${key}`);
        }
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

    await context.env.BTD6_INDEX_DB
    .prepare('INSERT OR IGNORE INTO "2mp_completions" (entity,map,person,link,og) SELECT ?1, ?2, ?3, ?4, ?5 '
    + 'WHERE NOT EXISTS (SELECT * FROM "2mp_completions" WHERE entity = ?1 AND map = ?2)')
    .bind(form_data.get('entity'), form_data.get('map'), form_data.get('person'), link, form_data.has('og') ? '1' : '0')
    .run();

    if (hasImage) {
        // upload only when uuid doesn't exist
        let r2Obj = await context.env.BTD6_INDEX_MEDIA.put(
            key, form_data.get('image').stream(), {onlyIf: {etagDoesNotMatch: '*'}}
        );
        if (r2Obj === null) {
            return redirectError('Failed to upload object');
        }
    }

    return Response.redirect(new URL('/admin/add-2mp-result?inserted=true', context.request.url), 302);
}