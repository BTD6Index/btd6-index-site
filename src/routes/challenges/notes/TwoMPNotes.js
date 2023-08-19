import { useSearchParams } from "react-router-dom";
import useNotesAndAttachments from "../../../util/useNotesAndAttachments";

export default function TwoMPNotes() {
    const [params, ] = useSearchParams();
    const {error, notes, attachmentKeys} = useNotesAndAttachments({
        challenge: '2mp', params
    });

    if (error) {
        return <>
            <h1>Error retrieving completion notes: {error}</h1>
            <p><a href='/2mp'>Back to 2MPs</a></p>
        </>; 
    } else if (notes === null) {
        return <></>;
    }

    return <>
        <h1>Notes for {params.get('entity')} 2MP</h1>
        <p>{notes || 'No notes for this completion'}</p>
        <h2>Attachments</h2>
        {
            attachmentKeys?.length ? <ul>{attachmentKeys.map(key => {
                const link = `https://media.btd6index.win/${key}`;
                return <li key={key}><a href={link}>{link}</a></li>;
            })}</ul> : <p>No attachments</p>
        }
        <p><a href='/2mp'>Back to 2MPs</a></p>
    </>;
}