import { handleAddSubmit } from "./handleAddSubmit";

export async function onRequest(context) {
    return handleAddSubmit({context, challenge: '2tc', fields: ['tower1', 'tower2', 'map']});
}
