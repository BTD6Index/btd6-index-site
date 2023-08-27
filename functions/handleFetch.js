import { processQuery } from "./processQuery";
import maps from './maps.json';

async function handleFetch({ context, primaryFieldKeys, personKeys, challenge }) {
    const db = context.env.BTD6_INDEX_DB;

    let search_params = new URL(context.request.url).searchParams;
    let query = search_params.get('query') ?? '';
    let offset = parseInt(search_params.get('offset') ?? '0');
    let count = Math.min(parseInt(search_params.get('count') ?? '10'), 100);
    
    let field_keys = [...primaryFieldKeys, ...personKeys, 'link', 'og', 'pending', 'difficulty'];
    let specific_field_conds = (param_pos) => {
        return field_keys
        .flatMap((field, idx) => {
            if (search_params.has(field)) {
                if (field === 'pending') {
                    return [`(${field} IS NULL) != (json_extract(?${param_pos}, '$[${idx}]') IN (1, '1', 'true', 'True'))`]
                } else if (field === 'difficulty') {
                    const filteredMaps = Object.entries(maps)
                    .filter(([, mapInfo]) => mapInfo.difficulty === search_params.get(field))
                    .map(([mapName,]) => `'${mapName.replace("'", "''")}'`);

                    return [`map IN (${filteredMaps.join(',')})`];
                }
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
        query_stmt = db
        .prepare(`SELECT * FROM "${challenge}_completions_fts" INNER JOIN "${challenge}_filekeys" USING (${primaryFieldKeys.join(',')}) `
        + `WHERE "${challenge}_completions_fts" = ?1 AND ${specific_field_conds(4)} ORDER BY ${primaryFieldKeys.join(',')} LIMIT ?2 OFFSET ?3`)
        .bind(processQuery(query, field_keys), count+1, offset, JSON.stringify(field_values));
    } else {
        query_stmt = db
        .prepare(`SELECT * FROM "${challenge}_completions_fts" INNER JOIN "${challenge}_filekeys" USING (${primaryFieldKeys.join(',')}) `
        + `WHERE ${specific_field_conds(3)} ORDER BY ${primaryFieldKeys.join(',')} LIMIT ?1 OFFSET ?2`)
        .bind(count+1, offset, JSON.stringify(field_values));
    }

    try {
        let query_result = await query_stmt.all();
        return Response.json({results: query_result['results'].slice(0, count), more: query_result['results'].length > count});
    } catch (e) {
        return Response.json({error: e.message}, {status: 400});
    }
}

export {handleFetch};