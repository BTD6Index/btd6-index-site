import { handleVerifySubmit } from "./handleVerifySubmit";

export async function onRequestPost(context) {
    return handleVerifySubmit({context, challenge: 'lcc', fields: ['filekey'], castFields: {filekey: 'uuid'}});
}
