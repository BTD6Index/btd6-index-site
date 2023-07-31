export async function onRequest(context) {
    let search_params = new URL(context.request.url).searchParams;
    let query = search_params.get('query');
    let query_stmt = context.env.BTD6_INDEX_DB
    .prepare(query ? 'SELECT * FROM "2tc_completions" WHERE "2tc_completions" = ?1' : 'SELECT * FROM "2tc_completions"')
    .bind(search_params.get('query'))
    let query_result = await query_stmt.all();
    return Response.json(query_result['results']);
}