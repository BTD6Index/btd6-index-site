export async function onRequest(context) {
    const db = context.env.BTD6_INDEX_DB;
    
    let searchParams = new URL(context.request.url).searchParams;

    let fieldKeys = ['tower', 'version'];

    let queryBuilder = ['TRUE'];
    let params = [];

    for (let fieldKey of fieldKeys) {
        if (searchParams.has(fieldKey)) {
            queryBuilder.push(`${fieldKey} = ?${queryBuilder.length}`)
            params.push(searchParams.get(fieldKey))
        }
    }

    let res = await db.prepare(`SELECT * FROM balance_changes WHERE ${queryBuilder.join(' AND ')}`)
    .bind(...params)
    .all();

    return Response.json({results: res.results});
}