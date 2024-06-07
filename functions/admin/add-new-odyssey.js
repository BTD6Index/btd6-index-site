export async function onRequestPost(context) {
    const db = context.env.BTD6_INDEX_DB;
    const formData = await context.request.formData();

    const fieldKeys = [
        'odysseyNumber', 'odysseyName', 'startDate', 'endDate', 'isExtreme', 'islandOne', 'islandTwo', 
        'islandThree', 'islandFour', 'islandFive', 'heroes', 'primaryTowers', 
        'militaryTowers', 'magicTowers', 'supportTowers', 'miscInfo'
    ];
    const requiredFieldKeys = [
        'odysseyNumber', 'odysseyName', 'startDate', 'endDate',
    ];

    for (let fieldKey of requiredFieldKeys) {
        if (!formData.has(fieldKey)) {
            return Response.json({error: `Missing required form element: ${fieldKey}`}, {status: 400});
        }
    }

    try {
        await db.prepare(`
            INSERT INTO odyssey_information
            VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16)
        `).bind(
            ...fieldKeys.map(field => {
                return formData.get(field);
            })
        ).run();
    } catch (e) {
        return Response.json({error: e.message}, {status: 400});
    }

    return Response.json({});
}