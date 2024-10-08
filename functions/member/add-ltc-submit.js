import { processImages, getWebhookUrls } from "./handleAddSubmit";
import profanityFilter from 'leo-profanity';
profanityFilter.remove('domination');

function expandSQLArray(paramNo, arrayLen) {
    let buf = [];
    for (let i = 0; i < arrayLen; ++i) {
        buf.push(`json_extract(?${paramNo}, '$[${i}]')`);
    }
    return buf.join(',');
}


export async function onRequestPost(context) {
    const db = context.env.BTD6_INDEX_DB;
    const media = context.env.BTD6_INDEX_MEDIA;
    const jwtResult = context.data.jwtResult;
    const isHelper = jwtResult.payload.permissions.includes('write:admin');

    const respondError = (error) => {
        return Response.json({ error }, { status: 400 });
    };

    let formData = await context.request.formData();

    const verify = formData.has('verify') && isHelper;
    const webhookUrls = getWebhookUrls(context, verify);

    const editMode = ['true', '1'].includes(formData.get('edit'));

    const fieldKeys = ['map', 'towerset', 'person', 'completiontype', 'upgradeset', 'version', 'date', 'notes'];
    const requiredFieldKeys = ['map', 'towerset', 'person', 'completiontype', 'upgradeset', 'notes'];
    for (let key of requiredFieldKeys) {
        if (!formData.has(key)) {
            return respondError(`Missing required key: ${key}`);
        }
        if (profanityFilter.check(formData.get(key))) {
            return respondError(`Profanity detected in field ${key}`);
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
            + `WHERE (map, towerset, completiontype) = (?4, ?5, ?6) AND ${isHelper ? 'TRUE' : 'pending = ?3'} RETURNING filekey`
        ).bind(
            JSON.stringify(fieldValues),
            link,
            verify ? null : jwtResult.payload.sub,
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
            verify ? null : jwtResult.payload.sub,
            imageKey
        );
    }

    try {
        imageKey = (await query.first()).filekey;

        await processImages({imageKey, context, editMode: editMode, formData: formData, media, link, hasImage});
    } catch (e) {
        return respondError(e.message);
    }
    
    for (let webhookUrl of webhookUrls) {
        context.waitUntil(
            media.list({prefix: `${imageKey}/attach`}).then(async (listRes) => {
                await fetch(webhookUrl, {
                    body: JSON.stringify({
                        "embeds": [{
                            "title": `${formData.get('completiontype').toUpperCase()} ${JSON.parse(formData.get('towerset')).length}TC on ${formData.get('map')} ${editMode ? 'Edited' : 'Submitted'}${verify ? ' and Verified' : ''}`,
                            "color": 16737024,
                            "fields": [
                                {
                                    "name": "Person",
                                    "value": formData.get('person'),
                                    "inline": true
                                },
                                {
                                    "name": "Notes and Attachments",
                                    "value": formData.get('notes') !== "" ? `${formData.get('notes')}` : "-# none :(",
                                    "inline": true
                                },
                                {
                                    "name": link ? "Link" : "",
                                    "value": link || ""
                                }
                            ],
                            "url": link ? link : `https://media.btd6index.win/${imageKey}`,
                            "image": {"url": link ? null : `https://media.btd6index.win/${imageKey}`},
                            "footer": {
                                "text": new Intl.DateTimeFormat('en-US', {dateStyle: 'full', timeStyle: 'long'}).format(Date.now())
                            }
                        }],
                        "username": "Glue Rat",
                        "avatar_url": "https://btd6index.win/GlueGunnerPetRatIcon.png",
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