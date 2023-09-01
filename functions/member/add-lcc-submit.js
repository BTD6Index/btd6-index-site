import { handleAddSubmitLCCLike } from "./handleAddSubmit";

export async function onRequest(context) {
    return handleAddSubmitLCCLike({context, challenge: 'lcc'});
}
