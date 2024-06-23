export async function onRequest(context) {
    const db = context.env.BTD6_INDEX_DB;
    let searchParams = new URL(context.request.url).searchParams;
    let res = await db
    .prepare('SELECT odysseyName FROM odyssey_information ORDER BY startDate')
    .all();
    return Response.json({results: res.results.map(v => v.odysseyName)});
}