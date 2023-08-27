export async function onRequest(context) {
    let searchParams = new URL(context.request.url).searchParams;
    if (!searchParams.has('key')) {
        return Response.json({error: "Need to specify file key"}, {status: 400});
    }
    let result = await context.env.BTD6_INDEX_MEDIA.list({
        prefix: `${searchParams.get('key')}/attach`
    });
    return Response.json({files: result.objects.map(obj => obj.key)});
}