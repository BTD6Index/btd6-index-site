import { createDbClient } from "../db";
import { backupAndDelete } from "../mediaBackup";

export async function onRequestPost(context) {
    const db = createDbClient(context);
    const formData = await context.request.formData();

    if (!formData.has('map')) {
        return Response.json({error: 'Need to specify map'}, {status: 400});
    }

    const res = await db.prepare('DELETE FROM map_information WHERE map = $1 RETURNING *')
    .bind(formData.get('map'))
    .first();

    context.waitUntil(backupAndDelete(context.env, `maps/${formData.get('map')}`));

    return Response.json({deleted: res !== null});
}