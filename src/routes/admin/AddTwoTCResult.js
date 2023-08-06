import { useSearchParams } from "react-router-dom";

export default function AddTwoTCResult() {
    let [queryParams, ] = useSearchParams();
    if (queryParams.has('error')) {
        return <>
            <h1>Error adding 2TC</h1>
            <p>{queryParams.get('error')}</p>
            <p><a href='/admin/add-2tc-form'>Try again</a> | <a href='/2tc'>View 2TCs</a></p>
        </>
    } else if (!queryParams.get('inserted')) {
        return <>
            <h1>2TC already exists</h1>
            <p><a href='/admin/add-2tc-form'>Add another</a> | <a href='/2tc'>View 2TCs</a></p>
        </>
    } else {
        return <>
            <h1>Successfully added 2TC</h1>
            <p><a href='/admin/add-2tc-form'>Add another</a> | <a href='/2tc'>View 2TCs</a></p>
        </>
    }
}