import { handleFetch } from "./handleFetch";

export async function onRequest(context) {
    return handleFetch({
        context,
        primaryFieldKeys: ['map', 'towerset'],
        personKeys: ['person'],
        extraKeys: ['tower'],
        challenge: 'fttc',
        customFieldQuery: ({field, idx, paramPos}) => {
            if (field === 'tower') {
                return `"fttc_completions_fts" = 'towerset:"' || REPLACE(json_extract(?${paramPos}, '$[${idx}]'), '"', '""') || '"'`;
            }
            return null;
        }
    });
}