import { handleVerifySubmit } from "./handleVerifySubmit";

export async function onRequest(context) {
    return handleVerifySubmit({context, challenge: '2mp', fields: ['entity', 'map']});
}