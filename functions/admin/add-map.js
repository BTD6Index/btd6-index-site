export async function onRequestPost(context) {
    const db = context.env.BTD6_INDEX_DB;
    const media = context.env.BTD6_INDEX_MEDIA;
    const formData = await context.request.formData();

    const OLD_MAP_KEY = 'oldMap';
    const fieldKeys = [
        'map', 'abbreviation', 'difficulty', 'hasLOS', 'hasWater', 'length', 'lengthNotes',
        'miscNotes', 'numEntrances', 'numExits', 'numObjects', 'removalCost', 'removalCostNotes',
        'version'
    ];
    const requiredFieldKeys = [
        'map', 'abbreviation', 'difficulty', 'length',
        'numEntrances', 'numExits', 'numObjects', 'version'
    ];
    for (let fieldKey of requiredFieldKeys) {
        if (!formData.has(fieldKey)) {
            return Response.json({error: `Missing required form element: ${fieldKey}`}, {status: 400});
        }
    }

    try {
        let paramsToAdd = fieldKeys.map(field => {
            if (field === 'hasLOS' || field === 'hasWater') {
                return formData.has(field) ? 1 : 0;
            }
            return formData.get(field);
        });
        if (formData.has(OLD_MAP_KEY)) {
            await db.prepare(`
                UPDATE map_information SET (${fieldKeys.join(',')})
                = (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14)
                WHERE map = ?15
            `).bind(...paramsToAdd, formData.get(OLD_MAP_KEY)).run();
        } else {
            await db.prepare(`
                INSERT INTO map_information
                VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14)
            `).bind(...paramsToAdd).run();
        }
    } catch (e) {
        return Response.json({error: e.message}, {status: 400});
    }

    if (formData.has('image')) {
        await media.put(`maps/${formData.get('map')}`, formData.get('image').stream())
    }

    return Response.json({});
}