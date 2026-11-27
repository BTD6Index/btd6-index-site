import { handleVerifySubmit } from "./handleVerifySubmit";

export async function onRequestPost(context) {
    return handleVerifySubmit({context, challenge: 'fttc', fields: ['map', 'towerset'], separateFilekeys: true});
}
