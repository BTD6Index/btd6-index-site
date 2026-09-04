import { createDbClient } from "./db";

export async function onRequest(context) {
    const db = createDbClient(context);
    let searchParams = new URL(context.request.url).searchParams;
    let res = await db
    .prepare('SELECT map FROM map_information WHERE ($1::VARCHAR IS NULL OR difficulty = $1::VARCHAR)')
    .bind(searchParams.get('difficulty') ?? null)
    .all();
    return Response.json({results: res.results.map(v => v.map)});
}