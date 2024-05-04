export async function onRequestPost(context) {
    const db = context.env.BTD6_INDEX_DB;
    const formData = await context.request.formData();

    const fieldKeys = [
        'tower', 'version', 'change', 'nature'
    ];
    const requiredFieldKeys = [
        'tower', 'version', 'change', 'nature'
    ];
    for (let fieldKey of requiredFieldKeys) {
        if (!formData.has(fieldKey)) {
            return Response.json({error: `Missing required form element: ${fieldKey}`}, {status: 400});
        }
    }

    try {
        let res = await db.prepare(`
            INSERT INTO balance_changes
            VALUES (?1, ?2, ?3, ?4, ?5)
            RETURNING *
        `).bind(
            ...fieldKeys.map(field => {
                return formData.get(field);
            }),
            crypto.randomUUID()
        ).first();

        return Response.json({uuid: res?.uuid ?? null});
    } catch (e) {
        return Response.json({error: e.message}, {status: 400});
    }
}