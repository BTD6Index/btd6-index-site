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
            'towerset': 'jsonb_array_length(towerset), towerset::text',
            'towerset DESC': 'jsonb_array_length(towerset) DESC, towerset::text DESC'
        },
        customFieldQuery: ({field, idx, paramPos}) => {
            if (field === 'towerincludes') {
                return `(lower(towerset::text)::jsonb @> lower($${paramPos}::jsonb ->> ${idx})::jsonb)`;
            } else if (field === 'towercount') {
                return `jsonb_array_length(towerset::jsonb) = CAST($${paramPos}::jsonb ->> ${idx} AS INTEGER)`;
            } else if (field == 'towerset') {
                return `(towerset = ($${paramPos}::jsonb ->> ${idx})::jsonb)`;
            }
            return null;
        }
    });
}