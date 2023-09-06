import { useState, useEffect } from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { useSearchParams } from "react-router-dom";
import remarkGfm from "remark-gfm";
import { AttachmentsList } from "./notesCommon";
import PageTitle from "../../../util/PageTitle";

export default function LCDNotes() {
    const [params, ] = useSearchParams();
    const [error, setError] = useState(null);
    const [notes, setNotes] = useState(null);
    const [attachments, setAttachments] = useState(null);
    useEffect(() => {
        fetch('/fetch-lcd?' + new URLSearchParams({
            filekey: params.get('filekey')
        }))
        .then(async (response) => {
            let json = await response.json();
            if ('error' in json) {
                throw new Error(json.error);
            } else if (json.results.length === 0) {
                throw new Error('Could not find LCD completion');
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
            <PageTitle>Error retrieving completion notes: {error}</PageTitle>
            <p><a href='/lcd'>Back to LCDs</a></p>
        </>; 
    } else if (notes === null) {
        return <></>;
    }

    return <>
        <PageTitle>Notes for LCD</PageTitle>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{notes || 'No notes for this completion'}</ReactMarkdown>
        <h2>Attachments</h2>
        <AttachmentsList attachmentKeys={attachments} />
        <p><a href='/lcd'>Back to LCDs</a></p>
    </>;
}
