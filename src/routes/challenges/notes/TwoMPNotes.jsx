import { useSearchParams } from "react-router-dom";
import { AttachmentsList, useNotesAndAttachments } from "./notesCommon";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import remarkGfm from "remark-gfm";
import PageTitle from "../../../util/PageTitle";

export default function TwoMPNotes() {
    const [params, ] = useSearchParams();
    const {error, notes, attachmentKeys} = useNotesAndAttachments({
        challenge: '2mp', params
    });

    if (error) {
        return <>
            <PageTitle>Error retrieving completion notes: {error}</PageTitle>
            <p><a href='/2mp'>Back to 2MPs</a></p>
        </>; 
    } else if (notes === null) {
        return <></>;
    }

    return <>
        <PageTitle>{`Notes for ${params.get('entity')} 2MP`}</PageTitle>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{notes || 'No notes for this completion'}</ReactMarkdown>
        <h2>Attachments</h2>
        <AttachmentsList attachmentKeys={attachmentKeys} />
        <p><a href='/2mp'>Back to 2MPs</a></p>
    </>;
}