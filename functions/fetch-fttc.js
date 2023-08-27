import { handleFetch } from "./handleFetch";

export async function onRequest(context) {
    return handleFetch({
        context,
        primaryFieldKeys: ['map', 'towerset'],
        personKeys: ['person'],
        extraKeys: ['towerincludes', 'towercount'],
        challenge: 'fttc',
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