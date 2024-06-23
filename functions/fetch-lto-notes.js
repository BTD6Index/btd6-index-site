export async function onRequest(context) {
    let searchParams = new URL(context.request.url).searchParams;
    let towerset = searchParams.get('towerset');
    let odysseyName = searchParams.get('odysseyName');
    if (towerset === null || odysseyName == null) {
        return Response.json({error: `need odysseyName and towerset specified`}, {status: 400});
    }
    let res = await context.env.BTD6_INDEX_DB
    .prepare('SELECT * FROM "lto_completion_notes" WHERE towerset = ?1 AND odysseyName = ?2')
    .bind(towerset, odysseyName)
    .first();
    if (res === null) {
        return Response.json({notes: ''});
    }
    return Response.json({notes: res['notes']});
}
