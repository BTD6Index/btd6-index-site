export async function onRequest(context) {
    let search_params = new URL(context.request.url).searchParams;
    let tower1 = search_params.get('tower1');
    let tower2 = search_params.get('tower2');
    let map = search_params.get('map');
    if (tower1 === null || tower2 === null || map == null) {
        return Response.json({error: `need entity and map specified`}, {status: 400});
    }
    let res = await context.env.BTD6_INDEX_DB
    .prepare('SELECT * FROM "2tcc_completion_notes" WHERE tower1 = ?1 AND tower2 = ?2 AND map = ?3')
    .bind(tower1, tower2, map)
    .first();
    if (res === null) {
        return Response.json({notes: ''});
    }
    return Response.json({notes: res['notes']});
}
