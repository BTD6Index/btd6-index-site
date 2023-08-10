import { useSearchParams } from "react-router-dom";

export default function AddTwoMPResult() {
    let [queryParams, ] = useSearchParams();
    let inserted = ['1', 'true'].includes(queryParams.get('inserted'));
    let edit_mode = ['1', 'true'].includes(queryParams.get('edit'));
    if (queryParams.has('error')) {
        return <>
            <h1>{edit_mode ? "Error editing 2MP" : "Error adding 2MP"}</h1>
            <p>{queryParams.get('error')}</p>
            <p>{!edit_mode && <><a href='/admin/add-2mp-form'>Try again</a> | </>}<a href='/2mp'>View 2MPs</a></p>
        </>
    } else if (!inserted) {
        return <>
            <h1>2MP already exists</h1>
            <p>{!edit_mode && <><a href='/admin/add-2mp-form'>Add another</a> | </>}<a href='/2mp'>View 2MPs</a></p>
        </>
    } else {
        return <>
            <h1>{edit_mode ? "Successfully edited 2MP" : "Successfully added 2MP"}</h1>
            <p>{!edit_mode && <><a href='/admin/add-2mp-form'>Add another</a> | </>}<a href='/2mp'>View 2MPs</a></p>
        </>
    }
}