export async function onRequest(context) {
    const db = context.env.BTD6_INDEX_DB;

    let search_params = new URL(context.request.url).searchParams;
    let query = search_params.get('query') ?? '';
    let offset = parseInt(search_params.get('offset') ?? '0');
    let count = Math.min(parseInt(search_params.get('count') ?? '10'), 100);
    
    let field_keys = ['tower1', 'tower2', 'map', 'person', 'link', 'og'];
    let specific_field_conds = (param_pos) => {
        return field_keys
        .flatMap((field, idx) => {
            if (search_params.has(field)) {
                return [`${field} = json_extract(?${param_pos}, '$[${idx}]')`];
            } else {
                return [];
            }
        }).join(' AND ') || `?${param_pos} = ?${param_pos}`;
    };
    let field_values = field_keys.map(field => search_params.get(field) ?? '');

    if (isNaN(offset)) {
        return Response.json({error: `invalid offset ${offset}`}, {status: 400});
    }
    if (offset < 0 || count <= 0) {
        return Response.json({results: [], more: false});
    }
    let query_stmt;
    if (query) {
        let tokenized_query = query.split(/\s+/);
        query_stmt = db
        .prepare(`SELECT * FROM "2tc_completions_fts" (?1) WHERE ${specific_field_conds(4)} ORDER BY tower1, tower2, map LIMIT ?2 OFFSET ?3`)
        .bind(tokenized_query.map(token => `"${token.replace('"', '\\"')}" *`).join(" AND "), count+1, offset, JSON.stringify(field_values));
    } else {
        query_stmt = db
        .prepare(`SELECT * FROM "2tc_completions_fts" WHERE ${specific_field_conds(3)} ORDER BY tower1, tower2, map LIMIT ?1 OFFSET ?2`)
        .bind(count+1, offset, JSON.stringify(field_values));
    }

    try {
        let query_result = await query_stmt.all();
        return Response.json({results: query_result['results'].slice(0, count-1), more: query_result['results'].length > count});
    } catch (e) {
        return Response.json({error: e.message}, {status: 400});
    }
}