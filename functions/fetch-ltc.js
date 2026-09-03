import { handleFetchFlat } from "./handleFetch";

export async function onRequest(context) {
    return handleFetchFlat({
        context,
        databaseTable: "ltc_completions",
        fields: ['map', 'towerset', 'link', 'completiontype', 'pending', 'upgradeset', 'version', 'date', 'filekey'],
        personFields: ['person'],
        sortByIndex: {
            'map': 'map',
            'map DESC': 'map DESC',
            'towerset': 'json_array_length(towerset), towerset',
            'towerset DESC': 'json_array_length(towerset) DESC, towerset DESC',
            'completiontype': 'completiontype',
            'completiontype DESC': 'completiontype DESC'
        },
        customFieldQuery: (field, idx, paramPos, searchParams) => {
            if (field === 'towerset') {
                return `towerset = ($${paramPos}::jsonb->>${idx})::jsonb`;
            }
            return null;
        }
    });
}