import BitSet from "bitset";
import { createDbClient } from "./db";

export async function onRequest(context) {
    const db = createDbClient(context);
    const res = await db.batch([
        db.prepare("SELECT entity, map FROM twomp_completions"),
        db.prepare("SELECT map, difficulty FROM map_information ORDER BY CASE difficulty WHEN 'beginner' THEN 0 WHEN 'intermediate' THEN 1 WHEN 'advanced' THEN 2 WHEN 'expert' THEN 3 ELSE 4 END, length DESC")
    ]);
    const mapList = res[1].results;
    const mapToIndex = new Map(mapList.map((val, idx) => [val.map, idx]));
    const tableData = new Map();
    for (let result of res[0].results) {
        let bitmap = tableData.get(result.entity);
        if (bitmap === undefined) {
            bitmap = new BitSet();
            tableData.set(result.entity, bitmap);
        }
        bitmap.set(mapToIndex.get(result.map), 1);
    }

    const tableDataJson = {};
    for (let [entity, bitmap] of tableData.entries()) {
        tableDataJson[entity] = bitmap.toString(16);
    }

    return Response.json({mapList, tableData: tableDataJson});
}