import { handleFetchOgInfo } from "./handleFetch";

export async function onRequest(context) {
    return handleFetchOgInfo({context, challenge: 'fttc', joinFields: ['map', 'towerset'], altJoinFields: []});
}
