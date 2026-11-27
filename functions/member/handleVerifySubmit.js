import { createDbClient } from "../db";
import { getWebhookUrls } from "./handleAddSubmit";

const challengeLabels = {
    twotc: '2TC',
    twotcc: '2TCC',
    twomp: '2MPC',
    fttc: 'FTTC',
    ltc: 'LTC',
    lcc: 'LCC',
    lcd: 'LCD'
};

const MAX_DESCRIPTION_LENGTH = 4000; // Discord embed description limit is 4096

function describeRow(row, fields) {
    const keyParts = fields
        .filter(field => field !== 'filekey')
        .map(field => typeof row[field] === 'string' ? row[field] : JSON.stringify(row[field]));
    if ('map' in row && !fields.includes('map')) {
        keyParts.push(row.map);
    }
    if ('money' in row) {
        keyParts.push(`$${row.money}`);
    }
    const person = 'person1' in row ? `${row.person1} & ${row.person2}` : row.person;
    const link = row.link || `https://media.btd6index.win/${row.filekey}`;
    return `- ${keyParts.join(' | ')} — ${person} ([Link](${link}))`;
}

async function handleVerifySubmit({context, challenge, fields, jsonFields = ['towerset'], castFields = {}, separateFilekeys = false}) {
    const db = createDbClient(context);
    const jwtResult = context.data.jwtResult;

    if (!jwtResult.payload.permissions.includes('write:verify')) {
        return Response.json({error: 'You do not have verifier perms'}, {status: 403});
    }

    let formData = await context.request.formData();
    if (!formData.has('entries')) {
        return Response.json({error: `Need ${challenge} entries to verify passed in`}, {status: 400});
    }

    const condition = fields.map((field, idx) => {
        let cast = '';
        if (jsonFields.includes(field)) {
            cast = '::jsonb';
        } else if (field in castFields) {
            cast = `::${castFields[field]}`;
        }
        return `cmp.${field} = (value->>${idx})${cast}`;
    }).join(' AND ');

    let rows;
    try {
        const updateStmt = `UPDATE "${challenge}_completions" AS cmp SET pending = NULL `
            + `WHERE cmp.pending IS NOT NULL AND EXISTS `
            + `(SELECT 1 FROM jsonb_array_elements($1::jsonb) AS value WHERE ${condition}) RETURNING cmp.*`;
        // some challenges keep filekeys in a separate table keyed by the completion's identifier fields
        const stmt = separateFilekeys
            ? `WITH verified AS (${updateStmt}) SELECT verified.*, fk.filekey FROM verified `
                + `LEFT JOIN "${challenge}_filekeys" AS fk USING (${fields.join(',')})`
            : updateStmt;
        rows = (await db.prepare(stmt)
            .bind(formData.get('entries'))
            .all()).results;
    } catch (e) {
        return Response.json({error: e.message}, {status: 400});
    }

    if (rows.length > 0) {
        let description = '';
        for (let i = 0; i < rows.length; ++i) {
            const line = describeRow(rows[i], fields) + '\n';
            if (description.length + line.length > MAX_DESCRIPTION_LENGTH) {
                description += `...and ${rows.length - i} more`;
                break;
            }
            description += line;
        }
        const body = JSON.stringify({
            "embeds": [{
                "title": `${rows.length} ${challengeLabels[challenge] ?? challenge.toUpperCase()} completion(s) verified`,
                "color": 16737024,
                "description": description,
                "footer": {
                    "text": new Intl.DateTimeFormat('en-US', {dateStyle: 'full', timeStyle: 'long'}).format(Date.now())
                }
            }],
            "username": "Glue Rat",
            "avatar_url": "https://btd6index.win/GlueGunnerPetRatIcon.png",
            "attachments": []
        });
        for (let webhookUrl of getWebhookUrls(context, true, challenge)) {
            context.waitUntil(fetch(webhookUrl, {
                body,
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                }
            }));
        }
    }

    return Response.json({verified: rows.length});
}

export { handleVerifySubmit };
