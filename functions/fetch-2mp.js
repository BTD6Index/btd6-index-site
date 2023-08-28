import { handleFetch } from "./handleFetch";
import towerNames from "./tower-names.json";

export async function onRequest(context) {
    return handleFetch({
        context,
        primaryFieldKeys: ['entity', 'map'],
        personKeys: ['person'],
        extraKeys: ['towerquery'],
        challenge: '2mp',
        customFieldQuery: ({field, searchParams, paramPos, idx}) => {
            if (field === 'towerquery') {
                let query = JSON.parse(searchParams.get('towerquery'));
                if (query.length === 0) {
                    return 'TRUE';
                } else if (query.length === 1) {
                    if (query[0] in towerNames) {
                        return `entity IN (${
                            Object.values(towerNames[query[0]]).map(v => `'${v.replace("'", "''")}'`).join(',')
                        })`;
                    } else {
                        return `entity = json_extract(json_extract(?${paramPos}, '$[${idx}]'), '$[0]')`;
                    }
                } else {
                    throw Error("towerquery array length should be 1 or fewer");
                }
            }
            return null;
        }
    });
}