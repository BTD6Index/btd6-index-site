import { handleDeleteSubmitLCCLike } from "./handleDeleteSubmit";

export async function onRequest(context) {
    return handleDeleteSubmitLCCLike({context, challenge: 'lcd'});
}