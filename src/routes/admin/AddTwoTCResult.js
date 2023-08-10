import { useSearchParams } from "react-router-dom";

export default function AddTwoTCResult() {
    let [queryParams, ] = useSearchParams();
    let inserted = ['1', 'true'].includes(queryParams.get('inserted'));
    let edit_mode = ['1', 'true'].includes(queryParams.get('edit'));
    if (queryParams.has('error')) {
        return <>
            <h1>{edit_mode ? "Error editing 2TC" : "Error adding 2TC"}</h1>
            <p>{queryParams.get('error')}</p>
            <p>{!edit_mode && <><a href='/admin/add-2tc-form'>Try again</a> | </>}<a href='/2tc'>View 2TCs</a></p>
        </>
    } else if (!inserted) {
        return <>
            <h1>2TC already exists</h1>
            <p>{!edit_mode && <><a href='/admin/add-2tc-form'>Add another</a> | </>}<a href='/2tc'>View 2TCs</a></p>
        </>
    } else {
        return <>
            <h1>{edit_mode ? "Successfully edited 2TC" : "Successfully added 2TC"}</h1>
            <p>{!edit_mode && <><a href='/admin/add-2tc-form'>Add another</a> | </>}<a href='/2tc'>View 2TCs</a></p>
        </>
    }
}