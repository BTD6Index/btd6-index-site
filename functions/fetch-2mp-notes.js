export async function onRequest(context) {
    let search_params = new URL(context.request.url).searchParams;
    let entity = search_params.get('entity');
    let map = search_params.get('map');
    if (entity === null || map == null) {
        return Response.json({error: `need entity and map specified`}, {status: 400});
    }
    let res = await context.env.BTD6_INDEX_DB
    .prepare('SELECT * FROM "2mp_completion_notes" WHERE entity = ?1 AND map = ?2')
    .bind(entity, map)
    .first();
    if (res === null) {
        return Response.json({notes: ''});
    }
    return Response.json({notes: res['notes']});
}
