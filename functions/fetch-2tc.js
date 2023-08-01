export async function onRequest(context) {
    let search_params = new URL(context.request.url).searchParams;
    let query = search_params.get('query');
    let offset = search_params.get('offset') ?? '0';
    let query_stmt;
    if (query) {
        query_stmt = context.env.BTD6_INDEX_DB
        .prepare(`SELECT * FROM "2tc_completions" WHERE "2tc_completions" = ?1 ORDER BY tower1, tower2, map LIMIT 10 OFFSET ?2`)
        .bind(query, offset);
    } else {
        query_stmt = context.env.BTD6_INDEX_DB
        .prepare(`SELECT * FROM "2tc_completions" ORDER BY tower1, tower2, map LIMIT 10 OFFSET ?1`)
        .bind(offset);
    }
    let query_result = await query_stmt.all();
    return Response.json(query_result['results']);
}