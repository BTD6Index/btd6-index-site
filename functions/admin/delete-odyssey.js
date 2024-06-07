export async function onRequestPost(context) {
    const db = context.env.BTD6_INDEX_DB;
    const formData = await context.request.formData();

    if (!formData.has('odysseyNumber')) {
        return Response.json({error: 'Need to specify odyssey'}, {status: 400});
    }

    const res = await db.prepare('DELETE FROM odyssey_information WHERE odysseyNumber = ?1 RETURNING *')
    .bind(formData.get('odysseyNumber'))
    .first();

    return Response.json({deleted: res !== null});
}