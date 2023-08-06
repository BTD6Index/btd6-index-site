import { useParams } from "react-router-dom";

export default function DeleteTwoTCResult() {
    let queryParams = useParams();
    if ('error' in queryParams) {
        return <>
            <h1>Error deleting 2TC(s)</h1>
            <p>{queryParams.error}</p>
            <p><a href='/2tc'>View 2TCs</a></p>
        </>
    } else {
        return <>
            <h1>Successfully deleted 2TC(s)</h1>
            <p><a href='/2tc'>View 2TCs</a></p>
        </>
    }
}