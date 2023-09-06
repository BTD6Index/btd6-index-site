import { handleDeleteSubmitLCCLike } from "./handleDeleteSubmit";

export async function onRequestPost(context) {
    return handleDeleteSubmitLCCLike({context, challenge: 'lcd'});
}