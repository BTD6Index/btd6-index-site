import {createRemoteJWKSet, jwtVerify} from "jose";

async function auth(context) {
    const authHeader = context.request.headers.get('Authorization');
    if (authHeader !== null) {
        const token = authHeader.substring(7);
        const jwks = createRemoteJWKSet(new URL('https://lordlandmaster.us.auth0.com/.well-known/jwks.json'));
        try {
            context.data.jwt_result = await jwtVerify(token, jwks, {
                issuer: 'https://lordlandmaster.us.auth0.com/',
                audience: 'https://btd6index.win/'
            });
        } catch (e) {
            return Response.json({error: 'Unauthorized access'}, {status: 401});
        }
    } else {
        return Response.json({error: 'Unauthorized access'}, {status: 401});
    }
    return await context.next();
}

export const onRequest = [auth];