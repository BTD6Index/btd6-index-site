import { handleFetch } from "./handleFetch";

export async function onRequest(context) {
    return handleFetch({
        context,
        primaryFieldKeys: ['map', 'towerset'],
        personKeys: ['person'],
        extraKeys: ['towerincludes', 'towercount'],
        challenge: 'fttc',
        sortByIndex: {
            'map': 'map',
            'map DESC': 'map DESC',
            'towerset': 'json_array_length(towerset), towerset',
            'towerset DESC': 'json_array_length(towerset) DESC, towerset DESC'
        },
        customFieldQuery: ({field, idx, paramPos}) => {
            if (field === 'towerincludes') {
                return `"fttc_completions_fts" = (SELECT 'towerset:"' || group_concat(REPLACE(towers.value, '"', '""'), ' ') || '"' FROM json_each(json_extract(?${paramPos}, '$[${idx}]')) AS towers)`;
            } else if (field === 'towercount') {
                return `json_array_length(towerset) = CAST(json_extract(?${paramPos}, '$[${idx}]') AS INTEGER)`;
            }
            return null;
        }
    });
}