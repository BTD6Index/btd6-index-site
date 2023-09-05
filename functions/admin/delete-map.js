export async function onRequestPost(context) {
    const db = context.env.BTD6_INDEX_DB;
    const formData = await context.request.formData();

    if (!formData.has('map')) {
        return Response.json({error: 'Need to specify map'}, {status: 400});
    }

    const res = await db.prepare('DELETE FROM map_information WHERE map = ?1 RETURNING *')
    .bind(formData.get('map'))
    .first();

    return Response.json({deleted: res !== null});
}