import { processQuery } from "./processQuery";

export async function onRequest(context) {
    const db = context.env.BTD6_INDEX_DB;

    let searchParams = new URL(context.request.url).searchParams;
    let offset = parseInt(searchParams.get('offset') ?? '0');
    let count = Math.min(parseInt(searchParams.get('count') ?? '10'), 100);

    let field_keys = [
        'query', 'map', 'towerset', 'person', 'link', 'completiontype', 'pending', 'upgradeset', 'version', 'date'
    ];
    let sql_condition = (paramPos) => {
        return field_keys.flatMap((field, idx) => {
            if (!searchParams.has(field)) {
                return [];
            } else if (field === 'query') {
                return searchParams.get(field) ? [`ltc_completions_fts MATCH json_extract(?${paramPos}, '$[${idx}]')`] : [];
            } else if (field === 'pending') {
                return [`(${field} IS NULL) != (json_extract(?${paramPos}, '$[${idx}]') IN (1, '1', 'true', 'True'))`];
            } else {
                return [`${field} = json_extract(?${paramPos}, '$[${idx}]')`];
            }
        }).join(' AND ') || `?${paramPos} = ?${paramPos}`;
    }
    let field_values = field_keys.map(field => {
        if (!searchParams.has(field)) {
            return '';
        }
        if (field === 'query') {
            return processQuery(searchParams.get(field), field_keys);
        }
        return searchParams.get(field);
    });
    if (isNaN(offset)) {
        return Response.json({error: `invalid offset ${offset}`}, {status: 400});
    }
    if (offset < 0 || count <= 0) {
        return Response.json({results: [], more: false});
    }

    try {
        const res = await db.prepare(`SELECT * FROM "ltc_completions_fts" WHERE ${sql_condition(1)} ORDER BY map LIMIT ?2 OFFSET ?3`)
        .bind(JSON.stringify(field_values), count+1, offset)
        .all();

        return Response.json({results: res['results'].slice(0, count), more: res['results'].length > count});
    } catch (e) {
        return Response.json({error: e.message}, {status: 400});
    }
}