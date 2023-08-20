import { useSearchParams } from "react-router-dom";
import useNotesAndAttachments from "../../../util/useNotesAndAttachments";

export default function TwoTCCNotes() {
    const [params, ] = useSearchParams();
    const {error, notes, attachmentKeys} = useNotesAndAttachments({
        challenge: '2tcc', params
    });

    if (error) {
        return <>
            <h1>Error retrieving completion notes: {error}</h1>
            <p><a href='/2tcc'>Back to 2TCCs</a></p>
        </>; 
    } else if (notes === null) {
        return <></>;
    }

    return <>
        <h1>Notes for {params.get('tower1')} and {params.get('tower2')} 2TC</h1>
        <p>{notes || 'No notes for this completion'}</p>
        <h2>Attachments</h2>
        {
            attachmentKeys?.length ? <ul>{attachmentKeys.map(key => {
                const link = `https://media.btd6index.win/${key}`;
                return <li key={key}><a href={link}>{link}</a></li>;
            })}</ul> : <p>No attachments</p>
        }
        <p><a href='/2tcc'>Back to 2TCCs</a></p>
    </>;
}