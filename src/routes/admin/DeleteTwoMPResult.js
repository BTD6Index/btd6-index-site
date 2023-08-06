import { useParams } from "react-router-dom";

export default function DeleteTwoMPResult() {
    let queryParams = useParams();
    if ('error' in queryParams) {
        return <>
            <h1>Error deleting 2MP(s)</h1>
            <p>{queryParams.error}</p>
            <p><a href='/2mp'>View 2MPs</a></p>
        </>
    } else {
        return <>
            <h1>Successfully deleted 2MP(s)</h1>
            <p><a href='/2mp'>View 2MPs</a></p>
        </>
    }
}