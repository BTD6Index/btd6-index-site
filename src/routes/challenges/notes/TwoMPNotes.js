import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";

export default function TwoMPNotes() {
    const [params, ] = useSearchParams();
    const [error, setError] = useState(null);
    const [notes, setNotes] = useState(null);
    useEffect(() => {
        fetch('/fetch-2mp-notes?' + params)
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
            <a href='/2mp'>Back to 2MPs</a>
        </>; 
    } else if (notes === null) {
        return <></>;
    }

    return <>
        <h1>Notes for {params.get('entity')} 2MP</h1>
        <p>{notes || 'No notes for this completion'}</p>
        <a href='/2mp'>Back to 2MPs</a>
    </>;
}