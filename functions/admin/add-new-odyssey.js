export async function onRequestPost(context) {
    const db = context.env.BTD6_INDEX_DB;
    const formData = await context.request.formData();

    const OLD_ODYSSEY_KEY = 'oldOdyssey';
    const fieldKeys = [
        'odysseyName', 'startDate', 'endDate', 'isExtreme', 'islandOne', 'islandTwo', 
        'islandThree', 'islandFour', 'islandFive', 'heroes', 'primaryTowers', 
        'militaryTowers', 'magicTowers', 'supportTowers', 'miscNotes'
    ];
    const requiredFieldKeys = [
        'odysseyName', 'startDate', 'endDate',
    ];

    for (let fieldKey of requiredFieldKeys) {
        if (!formData.has(fieldKey)) {
            return Response.json({error: `Missing required form element: ${fieldKey}`}, {status: 400});
        }
    }

    try {
        let paramsToAdd = fieldKeys.map(field => {
            if (field === 'isExtreme') {
                return formData.has(field) ? 1 : 0;
            }
            return formData.get(field);
        });
        if (formData.has(OLD_ODYSSEY_KEY)) {
            await db.prepare(`
                UPDATE odyssey_information SET (${fieldKeys.join(',')})
                = (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15)
                WHERE odysseyName = ?16
            `).bind(...paramsToAdd, formData.get(OLD_ODYSSEY_KEY)).run();
        } else {
            await db.prepare(`
                INSERT INTO odyssey_information
                VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15)
            `).bind(...paramsToAdd).run();
        }
    } catch (e) {
        return Response.json({error: e.message}, {status: 400});
    }

    return Response.json({});
}