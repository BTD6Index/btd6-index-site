import { useState, useEffect } from "react";
import ImageOrVideo from "../../../util/ImageOrVideo";

export function useNotesAndAttachments({ challenge, params }) {
    const [error, setError] = useState(null);
    const [notes, setNotes] = useState(null);
    const [attachmentKeys, setAttachmentKeys] = useState(null);
    useEffect(() => {
        fetch(`/fetch-${challenge}-notes?` + params)
        .then(async (response) => {
            let json = await response.json();
            if ('error' in json) {
                throw new Error(json.error);
            }
            setNotes(json.notes);
            let getFilekeyResult = await (await fetch(`/fetch-${challenge}?` + params)).json();
            if ('error' in getFilekeyResult) {
                throw new Error(getFilekeyResult.error);
            }
            let filekey = getFilekeyResult.results[0].filekey;
            setAttachmentKeys(
                (await (await fetch('/list-attachments?' + new URLSearchParams([['key', filekey]]))).json()).files
                );
        })
        .catch(e => {
            setError(e.message);
        });
    }, [challenge, params]);

    return {notes, error, attachmentKeys};
}

export function AttachmentsList({attachmentKeys}) {
    return attachmentKeys?.length ? attachmentKeys.map(key => {
            const link = `https://media.btd6index.win/${key}`;
            return <ImageOrVideo url={link} className={'attachment'} />;
        }) : <p>No attachments</p>;
}
