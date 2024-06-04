import { handleDeleteSubmit } from "./handleDeleteSubmit";

export async function onRequestPost(context) {
    return handleDeleteSubmit({context, challenge: 'twomp', fields: ['entity', 'map'], joinFields: ['entity']});
}