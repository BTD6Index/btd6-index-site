import Select from "react-select";
import selectStyle from "../../../util/selectStyle";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { mapToOptions, towerToOptions } from "../../../util/selectOptions";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import useCheckIfAdmin from "../../../util/useCheckIfAdmin";
import { useSubmitCallback } from "./manipCommon";

function ManipTwoMP({ editParams = null }) {
    const [isOG, setOG] = useState(false);

    const [existingInfo, setExistingInfo] = useState(null);
    const [ogInfo, setOGInfo] = useState(null);

    const theForm = useRef();

    const isAdmin = useCheckIfAdmin();

    const doEdit = editParams !== null;

    useEffect(() => {
        if (doEdit) {
            fetch('/fetch-2mp?' + new URLSearchParams([
                ['entity', editParams.get('entity')],
                ['map', editParams.get('map')]
            ])).then(async (res) => {
                let json = await res.json();
                if ('error' in json) {
                    console.log(json.error);
                    setExistingInfo(null);
                } else {
                    setExistingInfo(json.results);
                    let og = json.results?.[0]?.og;
                    setOG(!!og);
                    if (og) {
                        let ogRes = await fetch('/fetch-2mp-og-info?' + new URLSearchParams([
                            ['entity', editParams.get('entity')]
                        ]));
                        let ogJson = await ogRes.json();
                        if ('error' in ogJson) {
                            console.log(ogJson.error);
                            setOGInfo(null);
                        } else {
                            setOGInfo(ogJson.result);
                        }
                    }
                }
            });
        };
    }, [doEdit, editParams]);

    const submitCallback = useSubmitCallback({
        formRef: theForm, challenge: '2mp', oldLink: existingInfo?.[0]?.link
    });

    return <>
        <p><a href="/2mp">Back to 2MPs</a></p>
        <h1>{doEdit ? `Edit ${editParams.get('entity')} 2MP on ${editParams.get('map')}` : "Add a 2MP Completion"}</h1>
        <form method="post" encType="multipart/form-data" action="/member/add-2mp-submit" onSubmit={submitCallback} ref={theForm}>
            {(!doEdit || existingInfo?.[0]?.pending) && isAdmin ? <><span className="formLine">
                <label htmlFor="verify">Mark as verified?</label>
                <input type="checkbox" name="verify" />
            </span><br /></> : <input type="hidden" name="verify" value="on" />}
            <span className="formLine">
                <label htmlFor="entity">Tower</label>
                <Select name="entity" options={[...towerToOptions.values()]} styles={selectStyle} defaultValue={
                    towerToOptions.get(editParams?.get('entity')) ?? undefined
                } required />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="map">Map</label>
                <Select name="map" options={[...mapToOptions.values()]} styles={selectStyle} defaultValue={
                    mapToOptions.get(editParams?.get('map')) ?? undefined
                } required />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="person">Person</label>
                <input name="person" type="text" placeholder="Person" style={{ width: '14ch' }} defaultValue={existingInfo?.[0]?.person} required />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="link">Link</label>
                <input name="link" type="text" placeholder="Link" style={{ width: '14ch' }} defaultValue={existingInfo?.[0]?.link} />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="image">Or Upload Image</label>
                <input type="file" name="image" accept="image/jpeg, image/png, image/gif, image/webp, image/apng, video/webm, video/ogg, video/mp4" />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="notes">Completion Notes/Proof</label>
                <textarea name="notes" rows="5" cols="40"></textarea>
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="og">OG Completion?</label>
                <input type="checkbox" name="og" onChange={e => setOG(e.target.checked)} checked={isOG} />
            </span>
            <br />
            {
                isOG && <>
                    <span className="formLine">
                        <label htmlFor="upgrade">Upgrade</label>
                        <input name="upgrade" type="text" placeholder="Upgrade" style={{ width: '14ch' }} defaultValue={ogInfo?.upgrade} required />
                    </span>
                    <br />
                    <span className="formLine">
                        <label htmlFor="version">Update</label>
                        <input name="version" type="text" placeholder="Update" style={{ width: '14ch' }} defaultValue={ogInfo?.version} required />
                    </span>
                    <br />
                    <span className="formLine">
                        <label htmlFor="date">Completion Date</label>
                        <input name="date" type="date" placeholder="Completion Date" style={{ width: '14ch' }} defaultValue={ogInfo?.date} required />
                    </span>
                    <br />
                </>
            }
            {editParams && ['entity', 'map'].map(
                field => <input type="hidden" name={`edited-${field}`} key={field} value={editParams.get(field)} />)}
            <input type="hidden" name="edit" value={doEdit} />
            <input type="submit" name="submit" value={doEdit ? "Update 2MP" : "Add 2MP"} />
        </form>
    </>
};

const AddTwoMP = withAuthenticationRequired(() => {
    return <ManipTwoMP />;
});

const EditTwoMP = withAuthenticationRequired(() => {
    const [params,] = useSearchParams();
    if (!params.has('entity') || !params.has('map')) {
        return <h1>Need to specify entity and map</h1>;
    }
    return <ManipTwoMP editParams={params} />
});

export { AddTwoMP, EditTwoMP };
