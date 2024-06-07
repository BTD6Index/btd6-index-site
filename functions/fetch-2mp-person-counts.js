export async function onRequest(context) {
    const db = context.env.BTD6_INDEX_DB;
    const searchParams = new URL(context.request.url).searchParams;
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 30);
    const res = await db.prepare(`SELECT
    (SELECT count(*) FROM twomp_completions WHERE person = person0) AS count,
    person0 AS person,
    (SELECT map FROM twomp_completions WHERE person = person0 GROUP BY map ORDER BY count(*) DESC LIMIT 1) AS favoritemap,
    (SELECT difficulty FROM twomp_completions INNER JOIN map_information USING (map) WHERE person = person0 GROUP BY difficulty ORDER BY count(*) DESC LIMIT 1) AS favoritedifficulty
    FROM (SELECT DISTINCT person AS person0 FROM twomp_completions)
    ORDER BY count DESC LIMIT ?2 OFFSET ?1`).bind(offset, limit).all();
    return Response.json({personData: res.results});
}