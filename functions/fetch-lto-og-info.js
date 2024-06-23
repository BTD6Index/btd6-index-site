import { handleFetchOgInfo } from "./handleFetch";

export async function onRequest(context) {
    return handleFetchOgInfo({context, challenge: 'lto', joinFields: ['odysseyName', 'towerset'], altJoinFields: []});
}
