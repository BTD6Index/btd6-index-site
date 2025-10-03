export async function onRequest(context) {
    const db = context.env.BTD6_INDEX_DB;
    const searchParams = new URL(context.request.url).searchParams;
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 30);
    const og = parseInt(searchParams.get('og') ?? '0');
    const res = await db.prepare(`SELECT
    (SELECT count(*) FROM twotc_completions WHERE person = person0 AND (og OR ?3)) AS count,
    (SELECT count(DISTINCT map) FROM twotc_completions WHERE person = person0 AND (og OR ?3)) AS uniquecount,
    person0 AS person,
    (SELECT map FROM twotc_completions WHERE person = person0 AND (og OR ?3) GROUP BY map ORDER BY count(*) DESC LIMIT 1) AS favoritemap
    FROM (SELECT DISTINCT person AS person0 FROM twotc_completions)
    ORDER BY count DESC LIMIT ?2 OFFSET ?1`).bind(offset, limit, !og).all();
    return Response.json({personData: res.results});
}