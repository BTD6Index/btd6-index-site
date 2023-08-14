async function handleVerifySubmit({ context, challenge, fields }) {
    const db = context.env.BTD6_INDEX_DB;

    if (context.request.method !== "POST") {
        return Response.json({
            error: `Request method should be POST, got ${context.request.method}`
        }, {status: 400});
    }

    let form_data = await context.request.formData();

    for (let field of fields) {
        if (!form_data.has(field)) {
            return Response.json({
                error: `Missing field ${field}`
            }, {status: 400});
        }
    }

    try {
        await db.prepare(
            `UPDATE "${challenge}_completions" SET pending = NULL WHERE ${fields.map((field, idx) => `${field} = ${idx+1}`).join(' AND ')}`
        ).bind(...fields.map(field => form_data.get(field))).run();
    } catch (e) {
        return Response.json({error: e.message}, {status: 400});
    }

    return Response.json({});
}

export {handleVerifySubmit};