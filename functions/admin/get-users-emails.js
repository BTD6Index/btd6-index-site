export async function onRequest(context) {
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
    let resHandle = await fetch('https://lordlandmaster.us.auth0.com/api/v2/users?' + new URLSearchParams(
        {q: userIds.map(userId => `user_id="${userId.replace(/"/g, '\\"')}"`).join(' OR ')}
    ), {
        headers: {
            Authorization: `Bearer ${token.access_token}`
        }
    });
    let res = await resHandle.json();
    if (!resHandle.ok) {
        return Response.json({error: 'Error while calling management API: ' + res.message}, {status: 500});
    }
    let resByUserId = new Map(res.map(elem => [elem.user_id, elem.email]));
    return Response.json(userIds.map(id => resByUserId.get(id)));
}