import { handleFetch } from "./handleFetch";

export async function onRequest(context) {
    return handleFetch({
        context,
        primaryFieldKeys: ['odysseyName', 'towerset'],
        personKeys: ['person'],
        extraKeys: ['towerincludes', 'towercount'],
        challenge: 'lto',
        sortByIndex: {
            'odysseyName': 'odysseyName',
            'odysseyName DESC': 'odysseyName DESC',
            'towerset': 'json_array_length(towerset), towerset',
            'towerset DESC': 'json_array_length(towerset) DESC, towerset DESC'
        },
        customFieldQuery: ({field, idx, paramPos}) => {
            if (field === 'towerincludes') {
                return `"lto_completions_fts" = (SELECT 'towerset:"' || group_concat(REPLACE(towers.value, '"', '""'), ' ') || '"' FROM json_each(json_extract(?${paramPos}, '$[${idx}]')) AS towers)`;
            } else if (field === 'towercount') {
                return `json_array_length(towerset) = CAST(json_extract(?${paramPos}, '$[${idx}]') AS INTEGER)`;
            }
            return null;
        }
    });
}