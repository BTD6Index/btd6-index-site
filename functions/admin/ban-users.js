export async function onRequestPost(context) {
    let tokenHandle = await fetch('https://lordlandmaster.us.auth0.com/oauth/token', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            client_id: context.env.MGMT_API_CLIENT_ID,
            client_secret: context.env.MGMT_API_CLIENT_SECRET,
            audience: 'https://lordlandmaster.us.auth0.com/api/v2/',
            grant_type: 'client_credentials'
        })
    });
    let token = await tokenHandle.json();
    if (!tokenHandle.ok) {
        return Response.json({error: 'Error while calling management API: ' + token.message}, {status: 500});
    }
    const searchParams = new URL(context.request.url).searchParams;
    const userIds = searchParams.getAll('user_id');
    if (userIds.length > 100) {
        return Response.json({error: 'Cannot specify more than 100 user ids'}, {status: 400});
    }
    for (let userId of userIds) {
        let resHandle = await fetch(`https://lordlandmaster.us.auth0.com/api/v2/users/${encodeURIComponent(userId)}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token.access_token}`
            },
            body: {
                'blocked': true
            },
            method: 'patch'
        });
        let res = await resHandle.json();
        if (!resHandle.ok) {
            return Response.json({error: 'Error while calling management API: ' + res.message}, {status: 500});
        }
    }
    return new Response("", {status: 204});
}