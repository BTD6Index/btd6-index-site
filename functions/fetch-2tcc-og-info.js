import { handleFetchOgInfo } from "./handleFetch";

export async function onRequest(context) {
    return handleFetchOgInfo({context, challenge: '2tcc', joinFields: ['tower1', 'tower2'], altJoinFields: ['map']});
}
