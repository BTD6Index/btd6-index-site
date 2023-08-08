export async function onRequest(context) {
    let search_params = new URL(context.request.url).searchParams;
    let query = search_params.get('query') ?? '';
    let offset = parseInt(search_params.get('offset') ?? '0');
    let count = Math.min(parseInt(search_params.get('count') ?? '10'), 100);
    if (isNaN(offset)) {
        return Response.json({error: `invalid offset ${offset}`}, {status: 400});
    }
    if (offset < 0 || count <= 0) {
        return Response.json({results: [], more: false});
    }
    let query_stmt;
    if (query) {
        let tokenized_query = query.split(/\s+/);
        query_stmt = context.env.BTD6_INDEX_DB
        .prepare(`SELECT * FROM "2mp_completions" (?1) ORDER BY entity, map LIMIT ?3 OFFSET ?2`)
        .bind(tokenized_query.map(token => `"${token.replace('"', '\\"')}"`).join(" "), offset, count+1);
    } else {
        query_stmt = context.env.BTD6_INDEX_DB
        .prepare(`SELECT * FROM "2mp_completions" ORDER BY entity, map LIMIT ?2 OFFSET ?1`)
        .bind(offset, count+1);
    }
    let query_result = await query_stmt.all();
    return Response.json({results: query_result['results'].slice(0, count-1), more: query_result['results'].length > count});
}