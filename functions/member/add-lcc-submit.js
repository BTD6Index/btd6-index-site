import { handleAddSubmitLCCLike } from "./handleAddSubmit";

export async function onRequestPost(context) {
    return handleAddSubmitLCCLike({context, challenge: 'lcc'});
}
