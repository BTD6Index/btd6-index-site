import { handleFetchFlat } from "./handleFetch";

export async function onRequest(context) {
    return handleFetchFlat({
        context,
        databaseTable: "lcd_completions",
        fields: ['map', 'money', 'link', 'pending', 'version', 'date', 'filekey'],
        personFields: ['person']
    });
}