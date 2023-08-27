import { handleFetch } from "./handleFetch";

export async function onRequest(context) {
    return handleFetch({
        context,
        primaryFieldKeys: ['map', 'towerset'],
        personKeys: ['person'],
        extraKeys: ['towerincludes'],
        challenge: 'fttc',
        customFieldQuery: ({field, idx, paramPos}) => {
            if (field === 'towerincludes') {
                return `"fttc_completions_fts" = (SELECT 'towerset:"' || group_concat(REPLACE(towers.value, '"', '""'), ' ') || '"' FROM json_each(json_extract(?${paramPos}, '$[${idx}]')) AS towers)`;
            }
            return null;
        }
    });
}