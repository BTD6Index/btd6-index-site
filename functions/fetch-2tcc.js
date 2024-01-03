import { handleFetch } from "./handleFetch";
import towerNames from "./tower-names.json";

function convTowerSubquery(query, queryIdx, paramPos, idx) {
    const subquery = query[queryIdx];
    if (subquery in towerNames) {
        const searchList = Object.values(towerNames[subquery]).map(v => `'${v.replace(/'/g, "''")}'`).join(',');
        return `IN (${searchList})`;
    } else {
        return `= json_extract(json_extract(?${paramPos}, '$[${idx}]'), '$[${queryIdx}]')`;
    }
}

export async function onRequest(context) {
    return handleFetch({
        context,
        primaryFieldKeys: ['tower1', 'tower2'],
        altFieldKeys: ['map'],
        personKeys: ['person1', 'person2'],
        challenge: '2tcc',
        extraKeys: ['towerquery'],
        sortByIndex: {
            'map': 'map',
            'map DESC': 'map DESC',
            'tower1': 'tower1',
            'tower1 DESC': 'tower1 DESC',
            'tower2': 'tower2',
            'tower2 DESC': 'tower2 DESC',
        },
        customFieldQuery: ({field, searchParams, paramPos, idx}) => {
            if (field === 'towerquery') {
                let query = JSON.parse(searchParams.get('towerquery'));
                if (query.length === 0) {
                    return 'TRUE';
                } else if (query.length === 1) {
                    return `(tower1 ${convTowerSubquery(query, 0, paramPos, idx)} OR tower2 ${convTowerSubquery(query, 0, paramPos, idx)})`;
                } else if (query.length === 2) {
                    return `
                        ((tower1 ${convTowerSubquery(query, 0, paramPos, idx)} AND tower2 ${convTowerSubquery(query, 1, paramPos, idx)})
                        OR (tower2 ${convTowerSubquery(query, 0, paramPos, idx)} AND tower1 ${convTowerSubquery(query, 1, paramPos, idx)}))
                    `;
                } else {
                    throw Error("towerquery array length should be 2 or fewer");
                }
            }
            return null;
        }
    });
}
