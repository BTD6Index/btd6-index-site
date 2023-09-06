export async function onRequest(context) {
    const db = context.env.BTD6_INDEX_DB;
    
    let searchParams = new URL(context.request.url).searchParams;

    if (!searchParams.has('map')) {
        return Response.json({error: 'No map specified'}, {status: 400});
    }

    let res = await db.prepare('SELECT * FROM chimps_starts WHERE map = ?1')
    .bind(searchParams.get('map'))
    .all();

    return Response.json({results: res.results});
}