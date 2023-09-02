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
    
    let fieldKeys = [...primaryFieldKeys, ...personKeys, ...extraKeys, 'link', 'og', 'pending'];
    let sqlFieldKeys = [...fieldKeys, 'difficulty'].filter(field => searchParams.has(field));
    let specific_field_conds = (paramPos) => {
        return sqlFieldKeys
        .flatMap((field, idx) => {
            if (field === 'pending') {
                return [`(${field} IS NULL) != (json_extract(?${paramPos}, '$[${idx}]') IN (1, '1', 'true', 'True'))`]
            } else if (field === 'og') {
                return [`(${field} = 0) != (json_extract(?${paramPos}, '$[${idx}]') IN (1, '1', 'true', 'True'))`];
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
        }).concat(`?${paramPos} = ?${paramPos}`).join(' AND ');
    };
    let fieldValues = sqlFieldKeys.map(field => searchParams.get(field) ?? '');

    if (isNaN(offset) || offset < 0) {
        return Response.json({error: `invalid offset ${offset}`}, {status: 400});
    }
    if (isNaN(count) || count < 0) {
        return Response.json({error: `invalid count ${count}`}, {status: 400});
    }
    let query_stmt_fn;
    try {
        if (query) {
            query_stmt_fn = (select, limit, offset) => {
                return db.prepare(`
                    SELECT ${select} FROM "${challenge}_completions_fts" INNER JOIN "${challenge}_filekeys" USING (${primaryFieldKeys.join(',')})
                    WHERE "${challenge}_completions_fts" = ?1 AND ${specific_field_conds(4)} ORDER BY ${primaryFieldKeys.join(',')} LIMIT ?2 OFFSET ?3
                `).bind(processQuery(query, fieldKeys), limit, offset, JSON.stringify(fieldValues));
            };
        } else {
            query_stmt_fn = (select, limit, offset) => {
                return db.prepare(`
                    SELECT ${select} FROM "${challenge}_completions_fts" INNER JOIN "${challenge}_filekeys" USING (${primaryFieldKeys.join(',')})
                    WHERE ${specific_field_conds(3)} ORDER BY ${primaryFieldKeys.join(',')} LIMIT ?1 OFFSET ?2
                `)
                .bind(limit, offset, JSON.stringify(fieldValues));
            };
        }

        let query_result = await db.batch([query_stmt_fn('*', count+1, offset), query_stmt_fn('COUNT(*)', (1 << 31) - 1, 0)]);
        return Response.json({
            results: query_result[0]['results'].slice(0, count),
            more: query_result[0]['results'].length > count,
            count: query_result[1]['results'][0]['COUNT(*)']
        });
    } catch (e) {
        return Response.json({error: e.message}, {status: 400});
    }
}

async function handleFetchFlat({context, databaseTable, fields, personFields}) {
    const db = context.env.BTD6_INDEX_DB;

    let searchParams = new URL(context.request.url).searchParams;
    let offset = parseInt(searchParams.get('offset') ?? '0');
    let count = Math.min(parseInt(searchParams.get('count') ?? '10'), 100);

    let fieldKeys = [
        'query', ...fields, ...personFields
    ];
    let sql_condition = (paramPos) => {
        return fieldKeys.flatMap((field, idx) => {
            if (!searchParams.has(field)) {
                return [];
            } else if (field === 'query') {
                return searchParams.get(field) ? [`"${databaseTable}" MATCH json_extract(?${paramPos}, '$[${idx}]')`] : [];
            } else if (field === 'pending') {
                return [`(${field} IS NULL) != (json_extract(?${paramPos}, '$[${idx}]') IN (1, '1', 'true', 'True'))`];
            } else {
                return [`${field} = json_extract(?${paramPos}, '$[${idx}]') ${personFields.includes(field) ? 'COLLATE NOCASE' : ''}`];
            }
        }).join(' AND ') || `?${paramPos} = ?${paramPos}`;
    }
    let fieldValues = fieldKeys.map(field => {
        if (!searchParams.has(field)) {
            return '';
        }
        if (field === 'query') {
            return processQuery(searchParams.get(field), fieldKeys.filter(field => field != 'query'));
        }
        return searchParams.get(field);
    });
    if (isNaN(offset) || offset < 0) {
        return Response.json({error: `invalid offset ${offset}`}, {status: 400});
    }
    if (isNaN(count) || count < 0) {
        return Response.json({error: `invalid count ${count}`}, {status: 400});
    }

    try {
        const res = await db.batch([
            db.prepare(`SELECT * FROM "${databaseTable}" WHERE ${sql_condition(1)} ORDER BY map LIMIT ?2 OFFSET ?3`)
            .bind(JSON.stringify(fieldValues), count+1, offset),
            db.prepare(`SELECT COUNT(*) FROM "${databaseTable}" WHERE ${sql_condition(1)} ORDER BY map`)
            .bind(JSON.stringify(fieldValues))
        ]);

        return Response.json({
            results: res[0]['results'].slice(0, count),
            more: res[0]['results'].length > count,
            count: res[1]['results'][0]['COUNT(*)']
        });
    } catch (e) {
        return Response.json({error: e.message}, {status: 400});
    }
}

async function handleFetchOgInfo({context, challenge, joinFields, altJoinFields}) {
    let searchParams = new URL(context.request.url).searchParams;
    let joinFieldVals = joinFields.map(field => searchParams.get(field));
    if (joinFieldVals.some(val => val === null)) {
        return Response.json({error: `need ${joinFieldVals.join(', ')} specified`}, {status: 400});
    }
    let res = await context.env.BTD6_INDEX_DB
    .prepare(`
        SELECT * FROM "${challenge}_extra_info" AS a INNER JOIN "${challenge}_completions" AS b
        ON ${joinFields.map(field => `a.${field} = b.${field}`).join(' AND ')} AND b.og = 1
        INNER JOIN "${challenge}_filekeys" AS c
        ON ${joinFields.concat(altJoinFields).map(field => `b.${field} = c.${field}`).join(' AND ')}
        WHERE ${joinFields.map((field, idx) => `b.${field} = ?${idx+1}`).join(' AND ')}
    `)
    .bind(...joinFieldVals)
    .first();
    if (res === null) {
        return Response.json({error: 'specified completion doesn\'t exist'}, {status: 400});
    }
    return Response.json({result: res});
}

export {handleFetch, handleFetchFlat, handleFetchOgInfo};