import { handleVerifySubmit } from "./handleVerifySubmit";

export async function onRequestPost(context) {
    return handleVerifySubmit({context, challenge: 'lcd', fields: ['filekey'], castFields: {filekey: 'uuid'}});
}
