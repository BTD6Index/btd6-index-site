import { handleFetch } from "./handleFetch";

export async function onRequest(context) {
    return handleFetch({
        context,
        primaryFieldKeys: ['tower1', 'tower2', 'map'],
        personKeys: ['person'],
        challenge: '2tc'
    });
}