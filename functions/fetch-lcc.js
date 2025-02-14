import { handleFetchFlat } from "./handleFetch";

export async function onRequest(context) {
    return handleFetchFlat({
        context,
        databaseTable: "lcc_completions_fts",
        fields: ['map', 'money', 'link', 'pending', 'version', 'date', 'filekey'],
        personFields: ['person'],
        customOrder: "map, CAST(version AS INTEGER) DESC", // sort first by map, then by newest version first
        sortByIndex: {
            "money": "money",
            "money DESC": "money DESC"
        }
    });
}