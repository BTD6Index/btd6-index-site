import { handleFetchOgInfo } from "./handleFetch";

export async function onRequest(context) {
    return handleFetchOgInfo({context, challenge: 'twomp', joinFields: ['entity'], altJoinFields: ['map']});
}
