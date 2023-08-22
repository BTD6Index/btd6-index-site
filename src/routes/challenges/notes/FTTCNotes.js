import { useSearchParams } from "react-router-dom";
import useNotesAndAttachments from "../../../util/useNotesAndAttachments";

export default function FTTCNotes() {
    const [params, ] = useSearchParams();
    const {error, notes, attachmentKeys} = useNotesAndAttachments({
        challenge: 'fttc', params
    });

    if (error) {
        return <>
            <h1>Error retrieving completion notes: {error}</h1>
            <p><a href='/fttc'>Back to FTTCs</a></p>
        </>; 
    } else if (notes === null) {
        return <></>;
    }

    return <>
        <h1>Notes for {params.get('map')} FTTC</h1>
        <p>{notes || 'No notes for this completion'}</p>
        <h2>Attachments</h2>
        {
            attachmentKeys?.length ? <ul>{attachmentKeys.map(key => {
                const link = `https://media.btd6index.win/${key}`;
                return <li key={key}><a href={link}>{link}</a></li>;
            })}</ul> : <p>No attachments</p>
        }
        <p><a href='/fttc'>Back to FTTCs</a></p>
    </>;
}