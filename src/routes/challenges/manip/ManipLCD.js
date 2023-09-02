import Select from "react-select";
import selectStyle from "../../../util/selectStyle";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { mapToOptions } from "../../../util/selectOptions";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import useCheckIfAdmin from "../../../util/useCheckIfAdmin";
import { AttachmentsWidget, FormLinkImageEntry, useSubmitCallback } from "./manipCommon";
import useForceReload from "../../../util/useForceReload";

function ManipLCD({ editParams = null, setEditParams = null }) {
    const [existingInfo, setExistingInfo] = useState(null);
    const [existingAttachments, setExistingAttachments] = useState(null);
    const {reloadVar, forceReload} = useForceReload();

    const doEdit = editParams !== null;

    useEffect(() => {
        if (doEdit) {
            fetch('/fetch-lcd?' + new URLSearchParams(
                [['filekey', editParams?.get('filekey')]]
            )).then(async (res) => {
                let json = await res.json();
                setExistingInfo(json.results);
                let attachRes = await fetch('/list-attachments?' + new URLSearchParams({key: json.results[0].filekey}));
                attachRes = await attachRes.json();
                setExistingAttachments(attachRes.files);
            });
        }
    }, [editParams, reloadVar, doEdit]);

    const theForm = useRef();

    const isAdmin = useCheckIfAdmin();

    const submitCallback = useSubmitCallback({
        formRef: theForm, challenge: 'lcd', oldLink: existingInfo?.[0]?.link, setEditParams, forceReload
    });

    const [map, setMap] = useState(null);
    useEffect(() => {
        setMap(existingInfo?.[0]?.map)
    }, [existingInfo]);

    return <>
        <p><a href="/lcd">Back to LCDs</a></p>
        <h1>{doEdit ? `Edit LCD` : "Add an LCD Completion"}</h1>
        <form method="post" encType="multipart/form-data" action="/member/add-lcd-submit" onSubmit={submitCallback} ref={theForm}>
            {(!doEdit || existingInfo?.[0]?.pending) && isAdmin ? <><span className="formLine">
                <label htmlFor="verify">Mark as verified?</label>
                <input type="checkbox" name="verify" />
            </span><br /></> : <input type="hidden" name="verify" value="on" />}
            <span className="formLine">
                <label htmlFor="map">Map</label>
                <Select name="map" options={[...mapToOptions.values()]} styles={selectStyle} value={
                    mapToOptions.get(map) ?? undefined
                } required onChange={(val) => setMap(val.value)} />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="money">Cash Spent</label>
                <input name="money" type="number" style={{ width: '20ch' }} min={0} max={20200} defaultValue={existingInfo?.[0]?.money} required />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="person">Person</label>
                <input name="person" type="text" placeholder="Person" style={{ width: '20ch' }} defaultValue={existingInfo?.[0]?.person} required />
            </span>
            <br />
            <FormLinkImageEntry existingInfo={existingInfo} />
            <br />
            <span className="formLine">
                <label htmlFor="notes">Completion Notes/Proof (include challenge code here)</label>
                <textarea name="notes" rows="5" cols="40" defaultValue={existingInfo?.[0]?.notes}></textarea>
            </span>
            <br />
            <AttachmentsWidget existingAttachments={existingAttachments} attachmentsLabel="Upload Attachments (victory screen image, etc.)" />
            <br />
            <span className="formLine">
                <label htmlFor="version">Update</label>
                <input name="version" type="text" placeholder="Update" style={{ width: '20ch' }} defaultValue={existingInfo?.[0]?.version} />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="date">Completion Date</label>
                <input name="date" type="date" placeholder="Completion Date" style={{ width: '20ch' }} defaultValue={existingInfo?.[0]?.date} />
            </span>
            <br />
            {editParams && <input type="hidden" name='edited-filekey' value={editParams.get('filekey') ?? undefined} />}
            <input type="hidden" name="edit" value={doEdit} />
            <input type="submit" name="submit" value={doEdit ? "Update LCD" : "Add LCD"} />
        </form>
    </>
};

const AddLCD = withAuthenticationRequired(() => {
    return <ManipLCD />;
});

const EditLCD = withAuthenticationRequired(() => {
    const [params, setParams] = useSearchParams();
    if (!params.has('filekey')) {
        return <h1>Need to specify filekey</h1>;
    }
    return <ManipLCD editParams={params} setEditParams={setParams} />
});

export { AddLCD, EditLCD };
