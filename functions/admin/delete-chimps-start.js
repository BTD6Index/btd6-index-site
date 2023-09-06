export async function onRequestPost(context) {
    const db = context.env.BTD6_INDEX_DB;
    const formData = await context.request.formData();

    if (!formData.has('uuid')) {
        return Response.json({error: 'Need to specify uuid'}, {status: 400});
    }

    const res = await db.prepare('DELETE FROM chimps_starts WHERE uuid = ?1 RETURNING *')
    .bind(formData.get('uuid'))
    .first();

    return Response.json({deleted: res !== null});
}