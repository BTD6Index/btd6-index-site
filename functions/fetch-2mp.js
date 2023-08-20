import { handleFetch } from "./handleFetch";

export async function onRequest(context) {
    return handleFetch({
        context,
        primaryFieldKeys: ['entity', 'map'],
        personKeys: ['person'],
        challenge: '2mp'
    });
}