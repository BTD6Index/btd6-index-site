import { processImages } from "./handleAddSubmit";

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
    const jwt_result = context.data.jwt_result;
    const is_helper = jwt_result.payload.permissions.includes('write:admin');

    const respondError = (error) => {
        return Response.json({ error }, { status: 400 });
    };

    if (context.request.method !== "POST") {
        return respondError(`Request method should be POST, got ${context.request.method}`);
    }

    let formData = await context.request.formData();

    const verify = formData.has('verify') && is_helper;
    const webhookVar = context.env[verify ? 'WEBHOOKS' : 'WEBHOOKS_PENDING'];
    const webhookUrls = typeof webhookVar === 'string' ? JSON.parse(webhookVar) : (webhookVar ?? []);

    const editMode = ['true', '1'].includes(formData.get('edit'));

    const fieldKeys = ['map', 'towerset', 'person', 'completiontype', 'upgradeset', 'version', 'date', 'notes'];
    const requiredFieldKeys = ['map', 'towerset', 'person', 'completiontype', 'upgradeset', 'notes'];
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
        query = db.prepare(
            `UPDATE "ltc_completions" SET (${fieldKeys.join(',')}, link, pending) = (${expandSQLArray(1, fieldKeys.length)}, ?2, ?3) `
            + `WHERE (map, towerset, completiontype) = (?4, ?5, ?6) AND ${is_helper ? 'TRUE' : 'pending = ?3'} RETURNING filekey`
        ).bind(
            JSON.stringify(fieldValues),
            link,
            verify ? null : jwt_result.payload.sub,
            formData.get('edited-map'),
            formData.get('edited-towerset'),
            formData.get('edited-completiontype')
            );
    } else {
        query = db.prepare(
            `INSERT INTO "ltc_completions" (${fieldKeys.join(',')}, link, pending, filekey) `
            + `VALUES (${expandSQLArray(1, fieldKeys.length)}, ?2, ?3, ?4) RETURNING filekey`
        ).bind(
            JSON.stringify(fieldValues),
            link,
            verify ? null : jwt_result.payload.sub,
            imageKey
        );
    }

    try {
        imageKey = (await query.first()).filekey;
    } catch (e) {
        return respondError(e.message);
    }

    await processImages({imageKey, context, editMode: editMode, formData: formData, media, link, hasImage});
    
    for (let webhookUrl of webhookUrls) {
        context.waitUntil(
            media.list({prefix: `${imageKey}/attach`}).then(async (listRes) => {
                await fetch(webhookUrl, {
                    body: JSON.stringify({
                        "content": `**(${JSON.parse(formData.get('towerset')).join(', ')}) ${formData.get('completiontype').toUpperCase()} LTC on ${formData.get('map')} ${
                            editMode ? 'Edited' : 'Submitted'
                        }${verify ? ' and Verified' : ''}**\n`
                        + `Person: ${formData.get('person')}\n`
                        + `Link: ${link || `https://media.btd6index.win/${filekey}`}\n`
                        + `Notes and Attachments: https://btd6index.win/ltc/notes?${new URLSearchParams({
                            towerset: formData.get('towerset'),
                            map: formData.get('map')
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