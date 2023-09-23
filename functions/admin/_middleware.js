import {createRemoteJWKSet, jwtVerify} from "jose";

async function auth(context) {
    const authHeader = context.request.headers.get('Authorization');
    if (authHeader !== null) {
        const token = authHeader.substring(7);
        const jwks = createRemoteJWKSet(new URL('https://lordlandmaster.us.auth0.com/.well-known/jwks.json'));
        let result;
        try {
            result = await jwtVerify(token, jwks, {
                issuer: 'https://lordlandmaster.us.auth0.com/',
                audience: 'https://btd6index.win/'
            });
            if (!result?.payload?.permissions?.includes('write:admin')) {
                throw new Error('You do not have index helper perms');
            }
        } catch (e) {
            // 403 b/c user is already authenticated
            return Response.json({error: `Unauthorized access: ${e.message}`}, {status: 403});
        }
    } else {
        return Response.json({error: 'Unauthorized access'}, {status: 401});
    }
    return await context.next();
}

export const onRequest = [auth];