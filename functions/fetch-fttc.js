import { handleFetch } from "./handleFetch";

export async function onRequest(context) {
    return handleFetch({
        context,
        primaryFieldKeys: ['map', 'towerset'],
        personKeys: ['person'],
        challenge: 'fttc'
    });
}