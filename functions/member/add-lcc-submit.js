import { getWebhookUrls, processImages } from "./handleAddSubmit";

function expandSQLArray(paramNo, arrayLen) {
    let buf = [];
    for (let i = 0; i < arrayLen; ++i) {
        buf.push(`json_extract(?${paramNo}, '$[${i}]')`);
    }
    return buf.join(',');
}

export async function onRequest(context) {
    const db = context.env.BTD6_INDEX_DB;
    const media = context.env.BTD6_INDEX_MEDIA;
    const jwtResult = context.data.jwtResult;
    const isHelper = jwtResult.payload.permissions.includes('write:admin');

    const respondError = (error) => {
        return Response.json({ error }, { status: 400 });
    };

    if (context.request.method !== "POST") {
        return respondError(`Request method should be POST, got ${context.request.method}`);
    }

    let formData = await context.request.formData();

    const verify = formData.has('verify') && isHelper;
    const webhookUrls = getWebhookUrls(context, verify);

    const editMode = ['true', '1'].includes(formData.get('edit'));

    const fieldKeys = ['map', 'money', 'person', 'version', 'date', 'notes'];
    const requiredFieldKeys = [...fieldKeys];
    for (let key of requiredFieldKeys) {
        if (!formData.has(key)) {
            return respondError(`Missing required key: ${key}`);
        }
    }
    const fieldValues = fieldKeys.map(field => formData.get(field));

    if (!formData.has('link') && !formData.has('image')) {
        return respondError('Need one of link or image keys');
    }

    let link = null;
    let imageKey = crypto.randomUUID();

    const hasImage = formData.has('image') && formData.get('image') instanceof File;

    if (!hasImage) {
        link = formData.get('link') || null;
    }

    let query;
    if (editMode) {
        query = db.prepare(`
            UPDATE "lcc_completions" SET (${fieldKeys.join(',')}, link, pending) = (${expandSQLArray(1, fieldKeys.length)}, ?2, ?3)
            WHERE filekey = ?4 AND ${isHelper ? 'TRUE' : 'pending = ?3'} RETURNING filekey
        `).bind(
            JSON.stringify(fieldValues),
            link,
            verify ? null : jwtResult.payload.sub,
            formData.get('edited-filekey')
        );
    } else {
        query = db.prepare(`
            INSERT INTO "lcc_completions" (${fieldKeys.join(',')}, link, pending, filekey)
            VALUES (${expandSQLArray(1, fieldKeys.length)}, ?2, ?3, ?4) RETURNING filekey
        `).bind(
            JSON.stringify(fieldValues),
            link,
            verify ? null : jwtResult.payload.sub,
            imageKey
        );
    }

    try {
        imageKey = (await query.first()).filekey;
    } catch (e) {
        return respondError(e.message);
    }

    await processImages({imageKey, context, editMode, formData, media, link, hasImage});
    
    for (let webhookUrl of webhookUrls) {
        context.waitUntil(
            media.list({prefix: `${imageKey}/attach`}).then(async (listRes) => {
                await fetch(webhookUrl, {
                    body: JSON.stringify({
                        "content": `**${formData.get('map')} LCC ($${formData.get('money')}) on ${formData.get('map')} ${
                            editMode ? 'Edited' : 'Submitted'
                        }${verify ? ' and Verified' : ''}**\n`
                        + `Person: ${formData.get('person')}\n`
                        + `Link: ${link || `https://media.btd6index.win/${imageKey}`}\n`
                        + `Notes and Attachments: https://btd6index.win/lcc/notes?${new URLSearchParams({
                            filekey: formData.get('edited-filekey')
                        })}`,
                        "username": "Glue Rat",
                        "avatar_url": "https://btd6index.win/static/media/GlueGunnerPetRatIcon.949fcb9e188713ce4e4e.png",
                        "attachments": []
                    }),
                    method: "post",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
            })
        );
    }

    return Response.json({ inserted: true });
}