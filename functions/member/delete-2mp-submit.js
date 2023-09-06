import { handleDeleteSubmit } from "./handleDeleteSubmit";

export async function onRequestPost(context) {
    return handleDeleteSubmit({context, challenge: '2mp', fields: ['entity', 'map'], joinFields: ['entity']});
}