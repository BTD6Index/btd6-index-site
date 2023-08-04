export async function onRequest(context) {
    let search_params = new URL(context.request.url).searchParams;

    let find_existing = await context.env.BTD6_INDEX_DB
    .prepare('SELECT * FROM "2tc_completions" WHERE (tower1,tower2,map) = (?1, ?2, ?3)')
    .bind(search_params.tower1, search_params.tower2, search_params.map)
    .first();

    if (find_existing.length == 0) {
        await context.env.BTD6_INDEX_DB
        .prepare('INSERT INTO "2tc_completions" (tower1,tower2,map,person,link,og) VALUES (?1, ?2, ?3, ?4, ?5, ?6)')
        .bind(search_params.tower1, search_params.tower2, search_params.map, search_params.person, search_params.link, search_params.og)
        .run();
        return Response.json({inserted: true});
    }
    
    return Response.json({inserted: false});
}