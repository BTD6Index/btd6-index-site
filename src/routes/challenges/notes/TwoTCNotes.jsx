import { useSearchParams } from "react-router-dom";
import useNotesAndAttachments from "../../../util/useNotesAndAttachments";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import remarkGfm from "remark-gfm";
import ImageOrVideo from "../../../util/ImageOrVideo";

export default function TwoTCNotes() {
    const [params, ] = useSearchParams();
    const {error, notes, attachmentKeys} = useNotesAndAttachments({
        challenge: '2tc', params
    });

    if (error) {
        return <>
            <h1>Error retrieving completion notes: {error}</h1>
            <p><a href='/2tc'>Back to 2TCs</a></p>
        </>; 
    } else if (notes === null) {
        return <></>;
    }

    return <>
        <h1>Notes for {params.get('tower1')} and {params.get('tower2')} 2TC</h1>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{notes || 'No notes for this completion'}</ReactMarkdown>
        <h2>Attachments</h2>
        {
            attachmentKeys?.length ? attachmentKeys.map(key => {
                const link = `https://media.btd6index.win/${key}`;
                return <ImageOrVideo url={link} />;
            }) : <p>No attachments</p>
        }
        <p><a href='/2tc'>Back to 2TCs</a></p>
    </>;
}