import { handleFetchOgInfo } from "./handleFetch";

export async function onRequest(context) {
    return handleFetchOgInfo({context, challenge: '2mp', joinFields: ['entity'], altJoinFields: ['map']});
}
