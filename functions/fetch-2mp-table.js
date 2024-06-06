import BitSet from "bitset";

export async function onRequest(context) {
    const db = context.env.BTD6_INDEX_DB;
    const res = await db.batch([
        db.prepare("SELECT entity, map FROM twomp_completions"),
        db.prepare("SELECT map, difficulty FROM map_information ORDER BY json_extract(?1, '$.' || difficulty), length DESC")
        .bind(JSON.stringify({beginner: 0, intermediate: 1, advanced: 2, expert: 3}))
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