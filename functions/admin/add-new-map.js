export async function onRequestPost(context) {
    const db = context.env.BTD6_INDEX_DB;
    const formData = await context.request.formData();

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
        await db.prepare(`
            INSERT INTO map_information
            VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14)
        `).bind(
            ...fieldKeys.map(field => {
                if (field === 'hasLOS' || field === 'hasWater') {
                    return formData.has(field) ? 1 : 0;
                }
                return formData.get(field);
            })
        ).run();
    } catch (e) {
        return Response.json({error: e.message}, {status: 400});
    }

    return Response.json({});
}