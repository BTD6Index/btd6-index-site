import { imageObjectRegex } from "../imageObjectRegex";

export async function onRequest(context) {
    const db = context.env.BTD6_INDEX_DB;

    let rows = await db.prepare('SELECT entity, map, link FROM "2mp_completions"').all();

    let insertBatch = [];
    for (let row of rows.results) {
        let match = imageObjectRegex.exec(row.link);
        let filekey = match?.[1] ?? crypto.randomUUID();
        insertBatch.push(
            db.prepare('INSERT OR REPLACE INTO "2mp_filekeys" VALUES (?1, ?2, ?3)').bind(row.entity, row.map, filekey)
            );
    }
    
    await db.batch(insertBatch);

    return new Response("updated 2mp");
}