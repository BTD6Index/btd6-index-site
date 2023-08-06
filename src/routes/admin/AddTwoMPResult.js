import { useSearchParams } from "react-router-dom";

export default function AddTwoMPResult() {
    let [queryParams, ] = useSearchParams();
    if (queryParams.has('error')) {
        return <>
            <h1>Error adding 2MP</h1>
            <p>{queryParams.error}</p>
            <p><a href='/admin/add-2mp-form'>Try again</a> | <a href='/2mp'>View 2MPs</a></p>
        </>
    } else if (!queryParams.get('inserted')) {
        return <>
            <h1>2MP already exists</h1>
            <p><a href='/admin/add-2mp-form'>Add another</a> | <a href='/2mp'>View 2MPs</a></p>
        </>
    } else {
        return <>
            <h1>Successfully added 2MP</h1>
            <p><a href='/admin/add-2mp-form'>Add another</a> | <a href='/2mp'>View 2MPs</a></p>
        </>
    }
}