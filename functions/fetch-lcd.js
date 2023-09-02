import { handleFetchFlat } from "./handleFetch";

export async function onRequest(context) {
    return handleFetchFlat({
        context,
        databaseTable: "lcd_completions_fts",
        fields: ['map', 'money', 'link', 'pending', 'version', 'date', 'filekey'],
        personFields: ['person']
    });
}