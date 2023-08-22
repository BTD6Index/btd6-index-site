export async function onRequest(context) {
    let search_params = new URL(context.request.url).searchParams;
    let towerset = search_params.get('towerset');
    let map = search_params.get('map');
    if (towerset === null || map == null) {
        return Response.json({error: `need map and towerset specified`}, {status: 400});
    }
    let res = await context.env.BTD6_INDEX_DB
    .prepare('SELECT * FROM "fttc_completion_notes" WHERE towerset = ?1 AND map = ?2')
    .bind(towerset, map)
    .first();
    if (res === null) {
        return Response.json({notes: ''});
    }
    return Response.json({notes: res['notes']});
}
