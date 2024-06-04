export async function onRequest(context) {
    let searchParams = new URL(context.request.url).searchParams;
    let entity = searchParams.get('entity');
    let map = searchParams.get('map');
    if (entity === null || map == null) {
        return Response.json({error: `need entity and map specified`}, {status: 400});
    }
    let res = await context.env.BTD6_INDEX_DB
    .prepare('SELECT * FROM "twomp_completion_notes" WHERE entity = ?1 AND map = ?2')
    .bind(entity, map)
    .first();
    if (res === null) {
        return Response.json({notes: ''});
    }
    return Response.json({notes: res['notes']});
}
