export async function onRequest(context) {
    let search_params = new URL(context.request.url).searchParams;
    let tower1 = search_params.get('tower1');
    let tower2 = search_params.get('tower2');
    if (tower1 === null || tower2 === null) {
        return Response.json({error: `need tower1 and tower2 specified`}, {status: 400});
    }
    let res = await context.env.BTD6_INDEX_DB
    .prepare('SELECT * FROM "2tcc_extra_info" AS a INNER JOIN "2tcc_completions" AS b '
    + 'ON a.tower1 = b.tower1 AND a.tower2 = b.tower2 AND b.og = 1 WHERE (a.tower1, a.tower2) = (?1, ?2)')
    .bind(tower1, tower2)
    .first();
    if (res === null) {
        return Response.json({error: 'specified towers don\'t exist'}, {status: 400});
    }
    return Response.json({result: res});
}
