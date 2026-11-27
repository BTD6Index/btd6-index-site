import { handleVerifySubmit } from "./handleVerifySubmit";

export async function onRequestPost(context) {
    return handleVerifySubmit({context, challenge: 'ltc', fields: ['map', 'towerset', 'completiontype']});
}
