export async function onRequestPost(context) {
    const db = context.env.BTD6_INDEX_DB;
    const media = context.env.BTD6_INDEX_MEDIA;
    const jwtResult = context.data.jwtResult;
    const isHelper = jwtResult.payload.permissions.includes('write:admin');

    const respondError = (error) => {
        return Response.json({error}, {status: 400});
    };

    let formData = await context.request.formData();
    if (!formData.has('entries')) {
        return respondError(`Need ltc entries to delete passed in`);
    }

    let filekeys = await db.prepare(`DELETE FROM ltc_completions AS cmp WHERE EXISTS `
    + `(SELECT 1 FROM json_each(?1) `
    + `WHERE cmp.map = json_extract(value, '$[0]') `
    + `AND cmp.towerset = json_extract(value, '$[1]') `
    + `AND cmp.completiontype = json_extract(value, '$[2]') `
    + `AND ${isHelper ? '?2 = ?2' : 'cmp.pending = ?2'}) RETURNING filekey`)
    .bind(formData.get('entries'), jwtResult.payload.sub /* user id */)
    .all();

    for (let row of filekeys.results) {
        context.waitUntil(
            media.list({prefix: row.filekey})
            .then(async (listRes) => {
                await media.delete(listRes.objects.map(obj => obj.key));
            })
        );
    }

    return Response.json({});
}