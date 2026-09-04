import { handleFetchFlat } from "./handleFetch";

export async function onRequest(context) {
    return handleFetchFlat({
        context,
        databaseTable: "lcc_completions",
        fields: ['map', 'money', 'link', 'pending', 'version', 'date', 'filekey'],
        personFields: ['person'],
        customOrder: "map, coalesce(substring(version from '^[0-9]+'), '0')::numeric DESC", // sort first by map, then by newest version first
        sortByIndex: {
            "money": "money",
            "money DESC": "money DESC"
        }
    });
}