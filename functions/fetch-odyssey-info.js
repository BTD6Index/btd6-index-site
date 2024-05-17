export async function onRequest(context) {
    const db = context.env.BTD6_INDEX_DB;
    
    let searchParams = new URL(context.request.url).searchParams;

    if (!searchParams.has('odysseyName')) {
        return Response.json({error: 'No odyssey specified'}, {status: 400});
    }

    let res = await db.prepare('SELECT * FROM odyssey_information WHERE odysseyName = ?1')
    .bind(searchParams.get('odysseyName'))
    .first();

    return Response.json(res ?? {});
}