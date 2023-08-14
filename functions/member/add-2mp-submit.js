import { handleAddSubmit } from "./handleAddSubmit";

export async function onRequest(context) {
    return handleAddSubmit({context, challenge: '2mp',
    fields: ['entity', 'map'],
    extraInfoFields: ['entity', 'upgrade', 'version', 'date']});
}
