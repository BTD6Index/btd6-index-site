export async function onRequest(context) {
    const db = context.env.BTD6_INDEX_DB;
    let searchParams = new URL(context.request.url).searchParams;
    let res = await db
    .prepare('SELECT map FROM map_information WHERE (?1 IS NULL OR difficulty = ?1)')
    .bind(searchParams.get('difficulty') ?? null)
    .all();
    return Response.json({results: res.results.map(v => v.map)});
}