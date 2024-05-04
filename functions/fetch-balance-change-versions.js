export async function onRequest(context) {
    const db = context.env.BTD6_INDEX_DB;

    let searchParams = new URL(context.request.url).searchParams;

    let results;

    if (searchParams.has('tower')) {
        results = await db.prepare('SELECT DISTINCT version FROM balance_changes WHERE tower = ?1')
        .bind(searchParams.get('tower'))
        .all();
    } else {
        results = await db.prepare('SELECT DISTINCT version FROM balance_changes').bind().all();
    }

    return Response.json({results: results.results.map(result => result.version)});
}