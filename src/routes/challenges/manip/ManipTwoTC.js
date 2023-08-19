import Select from "react-select";
import selectStyle from "../../../util/selectStyle";
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { mapToOptions, towerToOptions } from "../../../util/selectOptions";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import useCheckIfAdmin from "../../../util/useCheckIfAdmin";
import { IMAGE_FORMATS, useFetchExistingInfo, useSubmitCallback } from "./manipCommon";

const FIELDS = ['tower1', 'tower2']; // needs to be outside so react doesn't treat value as changed every re-render

function ManipTwoTC({editParams = null, setEditParams = null}) {
    const [isOG, setOG] = useState(false);

    const {existingInfo, ogInfo, noteInfo} = useFetchExistingInfo({
        editParams,
        fields: FIELDS,
        challenge: '2tc'
    });

    const theForm = useRef();

    const isAdmin = useCheckIfAdmin();

    const doEdit = editParams !== null;

    useEffect(() => {
        setOG(!!existingInfo?.[0]?.og);
    }, [existingInfo]);

    const submitCallback = useSubmitCallback({
        formRef: theForm, challenge: '2tc', oldLink: existingInfo?.[0]?.link, setEditParams
    });

    return <>
        <p><a href="/2tc">Back to 2TCs</a></p>
        <h1>{
        doEdit
        ? `Edit ${editParams.get('tower1')} and ${editParams.get('tower2')} 2TC on ${editParams.get('map')}`
        : "Add a 2TC Completion"}</h1>
        <form method="post" encType="multipart/form-data" action="/member/add-2tc-submit" onSubmit={submitCallback} ref={theForm}>
            {(!doEdit || existingInfo?.[0]?.pending) && isAdmin ? <><span className="formLine">
                <label htmlFor="verify">Mark as verified?</label>
                <input type="checkbox" name="verify" />
            </span><br /></> : <input type="hidden" name="verify" value="on" />}
            <span className="formLine">
                <label htmlFor="tower1">Tower 1</label>
                <Select name="tower1" options={[...towerToOptions.values()]} styles={selectStyle} defaultValue={
                    towerToOptions.get(editParams?.get('tower1')) ?? undefined
                    } required />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="tower2">Tower 2</label>
                <Select name="tower2" options={[...towerToOptions.values()]} styles={selectStyle} defaultValue={
                    towerToOptions.get(editParams?.get('tower2')) ?? undefined
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
                <input name="person" type="text" placeholder="Person" style={{width: '14ch'}} defaultValue={existingInfo?.[0]?.person} required />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="link">Link</label>
                <input name="link" type="text" placeholder="Link" style={{width: '14ch'}} defaultValue={existingInfo?.[0]?.link}  />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="image">Or Upload Image/Video</label>
                <input type="file" name="image" accept={IMAGE_FORMATS} />
            </span>
            <br />
            <span className="formLine" style={{flexDirection: 'column'}}>
                <label htmlFor="notes">Completion Notes/Proof (Please specify challenge code here)</label>
                <textarea name="notes" rows="5" cols="40" defaultValue={noteInfo?.notes}></textarea>
            </span>
            <br />
            { /* <span className="formLine">
                <label htmlFor="attachments">Additional Attachments</label>
                <input type="file" name="attachments" accept={IMAGE_FORMATS} multiple />
            </span>
            <br /> */ }
            <span className="formLine">
                <label htmlFor="og">OG Completion?</label>
                <input type="checkbox" name="og" onChange={e => setOG(e.target.checked)} checked={isOG} />
            </span>
            <br />
            {
                isOG && <>
                    <span className="formLine">
                        <label htmlFor="upgrade1">Tower 1 Upgrade</label>
                        <input name="upgrade1" type="text" placeholder="Upgrade 1" style={{width: '14ch'}} defaultValue={ogInfo?.upgrade1} required />
                    </span>
                    <br />
                    <span className="formLine">
                        <label htmlFor="upgrade2">Tower 2 Upgrade</label>
                        <input name="upgrade2" type="text" placeholder="Upgrade 2" style={{width: '14ch'}} defaultValue={ogInfo?.upgrade2} required />
                    </span>
                    <br />
                    <span className="formLine">
                        <label htmlFor="version">Update</label>
                        <input name="version" type="text" placeholder="Update" style={{width: '14ch'}} defaultValue={ogInfo?.version} required />
                    </span>
                    <br />
                    <span className="formLine">
                        <label htmlFor="date">Completion Date</label>
                        <input name="date" type="date" placeholder="Completion Date" style={{width: '14ch'}} defaultValue={ogInfo?.date} required />
                    </span>
                    <br />
                </>
            }
            {editParams && ['tower1', 'tower2', 'map'].map(
                field => <input type="hidden" name={`edited-${field}`} key={field} value={editParams.get(field)} />)}
            <input type="hidden" name="edit" value={doEdit} />
            <input type="submit" name="submit" value={doEdit ? "Update 2TC" : "Add 2TC"} />
        </form>
    </>
};

const AddTwoTC = withAuthenticationRequired(() => {
    return <ManipTwoTC />;
});

const EditTwoTC = withAuthenticationRequired(() => {
    const [params, setParams] = useSearchParams();
    if (['tower1', 'tower2', 'map'].some(key => !params.has(key))) {
        return <h1>Need to specify tower1, tower2, and map</h1>;
    }
    return <ManipTwoTC editParams={params} setEditParams={setParams} />
});

export {AddTwoTC, EditTwoTC};