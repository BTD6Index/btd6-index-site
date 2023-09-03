import Select from "react-select";
import selectStyle from "../../../util/selectStyle";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { mapToOptions, towerTypeToOptions } from "../../../util/selectOptions";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import useCheckIfAdmin from "../../../util/useCheckIfAdmin";
import { AttachmentsWidget, FormLinkImageEntry, useFetchExistingInfo, useSubmitCallback } from "./manipCommon";

const FIELDS = ['map']; // needs to be outside so react doesn't treat value as changed every re-render
const ALT_FIELDS = ['towerset'];

function ManipFTTC({ editParams = null, setEditParams = null }) {
    const [isOG, setOG] = useState(false);

    const {existingInfo, ogInfo, noteInfo, existingAttachments, forceReload} = useFetchExistingInfo({
        editParams,
        fields: FIELDS,
        altFields: ALT_FIELDS,
        challenge: 'fttc'
    });

    useEffect(() => {
        setOG(!!existingInfo?.[0]?.og);
    }, [existingInfo]);

    const theForm = useRef();

    const isAdmin = useCheckIfAdmin();

    const doEdit = editParams !== null;

    const submitCallback = useSubmitCallback({
        formRef: theForm, challenge: 'fttc', oldLink: existingInfo?.[0]?.link, setEditParams, forceReload
    });

    const towersetList = editParams?.get('towerset') ? JSON.parse(editParams?.get('towerset')) : []

    const [towersetValue, setTowersetValue] = useState(JSON.stringify(towersetList));

    return <>
        <p><a href="/fttc">Back to FTTCs</a></p>
        <h1>{doEdit ? `Edit (${towersetList.join(', ')}) FTTC on ${editParams.get('map')}` : "Add an FTTC Completion"}</h1>
        <form method="post" encType="multipart/form-data" action="/member/add-fttc-submit" onSubmit={submitCallback} ref={theForm}>
            {(!doEdit || existingInfo?.[0]?.pending) && isAdmin ? <><span className="formLine">
                <label htmlFor="verify">Mark as verified?</label>
                <input type="checkbox" name="verify" />
            </span><br /></> : <input type="hidden" name="verify" value="on" />}
            <span className="formLine">
                <label htmlFor="map">Map</label>
                <Select name="map" options={[...mapToOptions.values()]} styles={selectStyle} defaultValue={
                    mapToOptions.get(editParams?.get('map')) ?? undefined
                } required />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="towerset">Tower Types</label>
                <Select
                    isMulti
                    options={[...towerTypeToOptions.values()]}
                    styles={selectStyle}
                    defaultValue={towersetList.map(towerType => towerTypeToOptions.get(towerType))}
                    onChange={useCallback((newValue) => {
                        setTowersetValue(JSON.stringify(newValue.map(val => val.value)));
                    }, [])}
                    required 
                />
                <input type="hidden" name="towerset" value={towersetValue} />
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
                <textarea name="notes" rows="5" cols="40" defaultValue={noteInfo?.notes}></textarea>
            </span>
            <br />
            <AttachmentsWidget existingAttachments={existingAttachments} attachmentsLabel="Upload Attachments (victory screen image, etc.)" />
            <br />
            <span className="formLine">
                <label htmlFor="og">OG Completion?</label>
                <input type="checkbox" name="og" onChange={e => setOG(e.target.checked)} checked={isOG} />
            </span>
            <br />
            {
                isOG && <>
                    <span className="formLine">
                        <label htmlFor="version">Update</label>
                        <input name="version" type="text" placeholder="Update" style={{ width: '20ch' }} defaultValue={ogInfo?.version} required />
                    </span>
                    <br />
                    <span className="formLine">
                        <label htmlFor="date">Completion Date</label>
                        <input name="date" type="date" placeholder="Completion Date" style={{ width: '20ch' }} defaultValue={ogInfo?.date} required />
                    </span>
                    <br />
                </>
            }
            {editParams && ['map', 'towerset'].map(
                field => <input type="hidden" name={`edited-${field}`} key={field} value={editParams.get(field) ?? undefined} />)}
            <input type="hidden" name="edit" value={doEdit} />
            <input type="submit" name="submit" value={doEdit ? "Update FTTC" : "Add FTTC"} />
        </form>
    </>
};

const AddFTTC = withAuthenticationRequired(() => {
    return <ManipFTTC />;
});

const EditFTTC = withAuthenticationRequired(() => {
    const [params, setParams] = useSearchParams();
    if (!params.has('towerset') || !params.has('map')) {
        return <h1>Need to specify map and towerset</h1>;
    }
    return <ManipFTTC editParams={params} setEditParams={setParams} />
});

export { AddFTTC, EditFTTC };
