import { useState, useEffect } from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { useSearchParams } from "react-router-dom";
import remarkGfm from "remark-gfm";
import { AttachmentsList } from "./notesCommon";

export default function LCCNotes() {
    const [params, ] = useSearchParams();
    const [error, setError] = useState(null);
    const [notes, setNotes] = useState(null);
    const [attachments, setAttachments] = useState(null);
    useEffect(() => {
        fetch('/fetch-lcc?' + new URLSearchParams({
            filekey: params.get('filekey')
        }))
        .then(async (response) => {
            let json = await response.json();
            if ('error' in json) {
                throw new Error(json.error);
            } else if (json.results.length === 0) {
                throw new Error('Could not find LCC completion');
            } else {
                let attachmentRes = await fetch('/list-attachments?' + new URLSearchParams({key: json.results[0].filekey}));
                attachmentRes = await attachmentRes.json();
                setNotes(json.results[0].notes || '');
                setAttachments(attachmentRes.files);
            }
        })
        .catch(e => {
            setError(e.message);
        });
    }, [params]);

    if (error) {
        return <>
            <h1>Error retrieving completion notes: {error}</h1>
            <p><a href='/lcc'>Back to LCCs</a></p>
        </>; 
    } else if (notes === null) {
        return <></>;
    }

    return <>
        <h1>Notes for LCC</h1>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{notes || 'No notes for this completion'}</ReactMarkdown>
        <h2>Attachments</h2>
        <AttachmentsList attachmentKeys={attachments} />
        <p><a href='/lcc'>Back to LCCs</a></p>
    </>;
}
