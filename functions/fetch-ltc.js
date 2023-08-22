import { processQuery } from "./processQuery";

export async function onRequest(context) {
    const db = context.env.BTD6_INDEX_DB;

    let search_params = new URL(context.request.url).searchParams;
    let offset = parseInt(search_params.get('offset') ?? '0');
    let count = Math.min(parseInt(search_params.get('count') ?? '10'), 100);

    let field_keys = [
        'query', 'map', 'towerset', 'person', 'link', 'completiontype', 'pending', 'upgradeset', 'version', 'date'
    ];
    let sql_condition = (param_pos) => {
        return field_keys.flatMap((field, idx) => {
            if (!search_params.has(field)) {
                return [];
            } else if (field === 'query') {
                return [`'ltc_completions_fts' = json_extract(?${param_pos}, '$[${idx}]')`];
            } else if (field === 'pending') {
                return [`(${field} IS NULL) != (json_extract(?${param_pos}, '$[${idx}]') IN (1, '1', 'true', 'True'))`];
            } else {
                return [`${field} = json_extract(?${param_pos}, '$[${idx}]')`];
            }
        }).join(' AND ') || `?${param_pos} = ?${param_pos}`;
    }
    let field_values = field_keys.map(field => {
        if (field === 'query') {
            return processQuery(search_params.get(field), field_keys);
        }
        return search_params.get(field) ?? '';
    });
    if (isNaN(offset)) {
        return Response.json({error: `invalid offset ${offset}`}, {status: 400});
    }
    if (offset < 0 || count <= 0) {
        return Response.json({results: [], more: false});
    }

    try {
        const res = await db.prepare(`SELECT * FROM "ltc_completions" WHERE ${sql_condition(1)} LIMIT ?2 OFFSET ?3`)
        .bind(JSON.stringify(field_values), count+1, offset)
        .all();

        return Response.json({results: res['results'].slice(0, count), more: res['results'].length > count});
    } catch (e) {
        return Response.json({error: e.message}, {status: 400});
    }
}