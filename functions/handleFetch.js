import { processQuery } from "./processQuery";
import maps from './maps.json';

/**
 * @callback customFieldQuery
 * @param {{field: string, idx: number, paramPos: number, searchParams: URLSearchParams}} args
 * @returns {string?}
 */

/**
 * @param {Object} args
 * @param args.context
 * @param {string[]} args.primaryFieldKeys
 * @param {string[]} args.personKeys
 * @param {string[]} args.extraKeys
 * @param {string} args.challenge
 * @param {customFieldQuery?} args.customFieldQuery
 * @returns 
 */
async function handleFetch({ context, primaryFieldKeys, personKeys, extraKeys = [], challenge, customFieldQuery = null }) {
    const db = context.env.BTD6_INDEX_DB;

    let searchParams = new URL(context.request.url).searchParams;
    let query = searchParams.get('query') ?? '';
    let offset = parseInt(searchParams.get('offset') ?? '0');
    let count = Math.min(parseInt(searchParams.get('count') ?? '10'), 100);
    
    let field_keys = [...primaryFieldKeys, ...personKeys, ...extraKeys, 'link', 'og', 'pending', 'difficulty'];
    let specific_field_conds = (paramPos) => {
        return field_keys
        .flatMap((field, idx) => {
            if (searchParams.has(field)) {
                if (field === 'pending') {
                    return [`(${field} IS NULL) != (json_extract(?${paramPos}, '$[${idx}]') IN (1, '1', 'true', 'True'))`]
                } else if (field === 'difficulty') {
                    const filteredMaps = Object.entries(maps)
                    .filter(([, mapInfo]) => mapInfo.difficulty === searchParams.get(field))
                    .map(([mapName,]) => `'${mapName.replace("'", "''")}'`);

                    return [`map IN (${filteredMaps.join(',')})`];
                }
                return [
                    customFieldQuery?.({field, idx, paramPos, searchParams})
                    ?? `${field} = json_extract(?${paramPos}, '$[${idx}]') ${personKeys.includes(field) ? 'COLLATE NOCASE' : ''}`
                ];
            } else {
                return [];
            }
        }).concat(`?${paramPos} = ?${paramPos}`).join(' AND ');
    };
    let field_values = field_keys.map(field => searchParams.get(field) ?? '');

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