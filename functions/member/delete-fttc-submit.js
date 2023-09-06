import { handleDeleteSubmit } from "./handleDeleteSubmit";

export async function onRequestPost(context) {
    return handleDeleteSubmit({context, challenge: 'fttc', fields: ['map', 'towerset'], joinFields: ['map']});
}