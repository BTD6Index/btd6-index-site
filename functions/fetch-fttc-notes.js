import { createDbClient } from "./db";

export async function onRequest(context) {
    let searchParams = new URL(context.request.url).searchParams;
    let towerset = searchParams.get('towerset');
    let map = searchParams.get('map');
    if (towerset === null || map == null) {
        return Response.json({error: `need map and towerset specified`}, {status: 400});
    }
    const db = createDbClient(context);
    let res = await db.prepare('SELECT * FROM "fttc_completion_notes" WHERE towerset = $1::jsonb AND map = $2')
    .bind(towerset, map)
    .first();
    if (res === null) {
        return Response.json({notes: ''});
    }
    return Response.json({notes: res['notes']});
}
