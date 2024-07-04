import { handleDeleteSubmit } from "./handleDeleteSubmit";

export async function onRequestPost(context) {
    return handleDeleteSubmit({context, challenge: 'lto', fields: ['odysseyName', 'towerset'], joinFields: ['odysseyName', 'towerset']});
}