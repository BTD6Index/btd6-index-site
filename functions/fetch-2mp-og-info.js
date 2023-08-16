export async function onRequest(context) {
    let search_params = new URL(context.request.url).searchParams;
    let entity = search_params.get('entity');
    if (entity === null) {
        return Response.json({error: `need entity specified`}, {status: 400});
    }
    let res = await context.env.BTD6_INDEX_DB
    .prepare('SELECT * FROM "2mp_extra_info" AS a INNER JOIN "2mp_completions" AS b '
    + 'ON a.entity = b.entity AND b.og = 1 WHERE a.entity = ?1')
    .bind(entity)
    .first();
    if (res === null) {
        return Response.json({error: 'specified tower doesn\'t exist'}, {status: 400});
    }
    return Response.json({result: res});
}
