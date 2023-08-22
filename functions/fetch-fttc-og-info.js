export async function onRequest(context) {
    let search_params = new URL(context.request.url).searchParams;
    let map = search_params.get('map');
    if (map === null) {
        return Response.json({error: `need map specified`}, {status: 400});
    }
    let res = await context.env.BTD6_INDEX_DB
    .prepare('SELECT * FROM "fttc_extra_info" AS a INNER JOIN "fttc_completions" AS b '
    + 'ON a.map = b.map AND b.og = 1 WHERE a.map = ?1')
    .bind(map)
    .first();
    if (res === null) {
        return Response.json({error: 'specified map doesn\'t exist'}, {status: 400});
    }
    return Response.json({result: res});
}
