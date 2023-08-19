export async function onRequest(context) {
    let search_params = new URL(context.request.url).searchParams;
    if (!search_params.has('key')) {
        return Response.json({error: "Need to specify file key"}, {status: 400});
    }
    let result = await context.env.BTD6_INDEX_MEDIA.list({
        prefix: `${search_params.get('key')}/attach`
    });
    return Response.json({files: result.objects.map(obj => obj.key)});
}