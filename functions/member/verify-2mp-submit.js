import { handleVerifySubmit } from "./handleVerifySubmit";

export async function onRequestPost(context) {
    return handleVerifySubmit({context, challenge: 'twomp', fields: ['entity', 'map'], separateFilekeys: true});
}
