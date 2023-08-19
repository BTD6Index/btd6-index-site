import { imageObjectRegex } from "../imageObjectRegex";

export async function onRequest(context) {
    const db = context.env.BTD6_INDEX_DB;

    let rows = await db.prepare('SELECT tower1, tower2, map, link FROM "2tc_completions"').all();

    let insertBatch = [];
    for (let row of rows.results) {
        let match = imageObjectRegex.exec(row.link);
        let filekey = match?.[1] ?? crypto.randomUUID();
        insertBatch.push(
            db.prepare('INSERT OR REPLACE INTO "2tc_filekeys" VALUES (?1, ?2, ?3, ?4)').bind(row.tower1, row.tower2, row.map, filekey)
            );
    }
    
    await db.batch(insertBatch);

    return new Response("updated 2tc");
}