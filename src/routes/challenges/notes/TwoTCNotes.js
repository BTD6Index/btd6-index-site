import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";

export default function TwoTCNotes() {
    const [params, ] = useSearchParams();
    const [error, setError] = useState(null);
    const [notes, setNotes] = useState(null);
    useEffect(() => {
        fetch('/fetch-2tc-notes?' + params)
        .then(async (response) => {
            let json = await response.json();
            if ('error' in json) {
                setError(json.error);
            } else {
                setNotes(json.notes);
            }
        });
    }, [params]);

    if (error) {
        return <>
            <h1>Error retrieving completion notes: {error}</h1>
            <a href='/2tc'>Back to 2TCs</a>
        </>; 
    } else if (notes === null) {
        return <></>;
    }

    return <>
        <h1>Notes for {params.get('tower1')} and {params.get('tower2')} 2TC</h1>
        <p>{notes || 'No notes for this completion'}</p>
        <a href='/2tc'>Back to 2TCs</a>
    </>;
}