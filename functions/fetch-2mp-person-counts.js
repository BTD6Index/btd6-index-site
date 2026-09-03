import { createDbClient } from "./db";

export async function onRequest(context) {
    const db = createDbClient(context);
    const searchParams = new URL(context.request.url).searchParams;
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 30);
    const res = await db.prepare(`SELECT
    (SELECT count(*) FROM twomp_completions WHERE person = person0) AS count,
    (SELECT count(DISTINCT map) FROM twomp_completions WHERE person = person0) AS uniquecount,
    person0 AS person,
    (SELECT map FROM twomp_completions WHERE person = person0 GROUP BY map ORDER BY count(*) DESC LIMIT 1) AS favoritemap,
    (SELECT difficulty FROM twomp_completions INNER JOIN map_information ON twomp_completions.map = map_information.map WHERE person = person0 GROUP BY twomp_completions.difficulty ORDER BY count(*) DESC LIMIT 1) AS favoritedifficulty
    FROM (SELECT DISTINCT person AS person0 FROM twomp_completions)
    ORDER BY count DESC LIMIT $2 OFFSET $1`).bind(offset, limit).all();
    return Response.json({personData: res.results});
}