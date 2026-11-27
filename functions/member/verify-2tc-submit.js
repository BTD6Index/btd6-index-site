import { handleVerifySubmit } from "./handleVerifySubmit";

export async function onRequestPost(context) {
    return handleVerifySubmit({context, challenge: 'twotc', fields: ['tower1', 'tower2', 'map']});
}
