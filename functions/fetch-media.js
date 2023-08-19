export async function onRequest(context) {
    let search_params = new URL(context.request.url).searchParams;
    let obj = await context.env.BTD6_INDEX_MEDIA.get(search_params.get('key') ?? '');
    if (!obj) {
        return Response.json({error: "Media object not found"}, {status: 404});
    }
    return new Response(obj.body, {
        headers: {
            'Content-Type': obj.httpMetadata?.contentType,
            'Content-Language': obj.httpMetadata?.contentLanguage,
            //'Content-Disposition': obj.httpMetadata?.contentDisposition,
            'Content-Encoding': obj.httpMetadata?.contentEncoding,
            'Cache-Control': obj.httpMetadata?.cacheControl,
            'Expires': obj.httpMetadata?.cacheExpiry?.toUTCString()
        }
    });
}