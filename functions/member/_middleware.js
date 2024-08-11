import {createRemoteJWKSet, jwtVerify} from "jose";

async function auth(context) {
    const authHeader = context.request.headers.get('Authorization');
    if (authHeader !== null) {
        const token = authHeader.substring(7);
        const jwks = createRemoteJWKSet(new URL('https://lordlandmaster.us.auth0.com/.well-known/jwks.json'));
        try {
            context.data.jwtResult = await jwtVerify(token, jwks, {
                issuer: 'https://lordlandmaster.us.auth0.com/',
                audience: 'https://btd6index.win/'
            });
            if (!context.data.jwtResult?.payload?.permissions?.includes('write:member')) {
                throw new Error('You do not have index helper perms');
            }
        } catch (e) {
            // 403 b/c user is already authenticated
            return Response.json({error: `Unauthorized access: ${e.message}`}, {status: 403});
        }
    } else {
        return Response.json({error: 'Unauthorized access'}, {status: 401});
    }

    let auditWebhooks = context.env.WEBHOOKS_AUDIT
    auditWebhooks = typeof auditWebhooks === 'string' ? JSON.parse(auditWebhooks) : (auditWebhooks ?? []);

    for (let webhook of auditWebhooks) {
        try {
            await fetch(webhook, {
                body: JSON.stringify({
                    "content": `URL: ${context.request.url}
User ID (in Auth0, go to User Management -> Users and search for \`user_id:"<user_id>"\` by \`Lucene syntax (advanced)\`): \`${context.data.jwtResult?.payload?.sub}\`
Request body (excluding file contents): \`${
    JSON.stringify([...(await context.request.formData()).entries()].filter(([, value]) => typeof value === 'string'))
}\``,
                    "username": "Glue Rat",
                    "avatar_url": "https://btd6index.win/GlueGunnerPetRatIcon.png",
                    "attachments": []
                }),
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                }
            })
        } catch (ex) {
            console.error(ex);
        }
    }
    

    return await context.next();
}

export const onRequest = [auth];
