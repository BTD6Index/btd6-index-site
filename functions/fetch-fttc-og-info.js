import { handleFetchOgInfo } from "./handleFetch";

export async function onRequest(context) {
    return handleFetchOgInfo({context, challenge: 'fttc',
        joinFields: ['map', 'towerset'], altJoinFields: [],
        customCheck: (field, idx) => field === 'towerset' ? `b.${field} = ($1::jsonb->>${idx})::jsonb` : null});
}
