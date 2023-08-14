import { handleVerifySubmit } from "./handleVerifySubmit";

export async function onRequest(context) {
    return handleVerifySubmit({context, challenge: '2tc', fields: ['tower1', 'tower2', 'map']});
}
