import { handleFetchFlat } from "./handleFetch";

export async function onRequest(context) {
    return handleFetchFlat({
        context,
        databaseTable: "ltc_completions_fts",
        fields: ['map', 'towerset', 'link', 'completiontype', 'pending', 'upgradeset', 'version', 'date', 'filekey'],
        personFields: ['person']
    });
}