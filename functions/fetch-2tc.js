export async function onRequest(context) {
    let search_params = new URL(context.request.url).searchParams;
    let query = search_params.get('query') ?? '';
    let offset = parseInt(search_params.get('offset') ?? '0');
    let count = parseInt(search_params.get('count') ?? '10');
    if (isNaN(offset)) {
        return Response.json({error: `invalid offset ${offset}`}, {status: 400});
    }
    if (offset < 0) {
        return Response.json([]);
    }
    let query_stmt;
    if (query) {
        let tokenized_query = query.split(/\s+/);
        query_stmt = context.env.BTD6_INDEX_DB
        .prepare(`SELECT * FROM "2tc_completions" (?1) ORDER BY tower1, tower2, map LIMIT ?3 OFFSET ?2`)
        .bind(tokenized_query.map(token => `"${token.replace('"', '\\"')}"`).join(" "), offset, count);
    } else {
        query_stmt = context.env.BTD6_INDEX_DB
        .prepare(`SELECT * FROM "2tc_completions" ORDER BY tower1, tower2, map LIMIT ?2 OFFSET ?1`)
        .bind(offset, count);
    }
    let query_result = await query_stmt.all();
    return Response.json(query_result['results']);
}