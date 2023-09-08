import Select from "react-select";
import selectStyle from "../../../util/selectStyle";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { towerToOptions } from "../../../util/selectOptions";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import useCheckIfAdmin from "../../../util/useCheckIfAdmin";
import { AttachmentsWidget, FormLinkImageEntry, useFetchExistingInfo, useSubmitCallback } from "./manipCommon";
import MapSelect from "../../../util/MapSelect";
import PageTitle from "../../../util/PageTitle";

const FIELDS = ['entity']; // needs to be outside so react doesn't treat value as changed every re-render

function ManipTwoMP({ editParams = null, setEditParams = null }) {
    const [isOG, setOG] = useState(false);

    const {existingInfo, ogInfo, noteInfo, existingAttachments, forceReload} = useFetchExistingInfo({
        editParams,
        fields: FIELDS,
        challenge: '2mp'
    });

    useEffect(() => {
        setOG(!!existingInfo?.[0]?.og);
    }, [existingInfo]);

    const theForm = useRef();

    const isAdmin = useCheckIfAdmin();

    const doEdit = editParams !== null;

    const submitCallback = useSubmitCallback({
        formRef: theForm, challenge: '2mp', oldLink: existingInfo?.[0]?.link, setEditParams, forceReload
    });

    const [map, setMap] = useState(null);
    useEffect(() => {
        setMap(existingInfo?.[0]?.map)
    }, [existingInfo]);

    return <>
        <p><a href="/2mp">Back to 2MPs</a></p>
        <PageTitle>{doEdit ? `Edit ${editParams.get('entity')} 2MP on ${editParams.get('map')}` : "Add a 2MP Completion"}</PageTitle>
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
                <MapSelect name="map" inputId="map" mapValue={map} required onChange={(val) => setMap(val.value)} />
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
                <label htmlFor="notes">Completion Notes/Proof</label>
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
                        <label htmlFor="upgrade">Upgrade</label>
                        <input name="upgrade" type="text" placeholder="Upgrade" style={{ width: '20ch' }} defaultValue={ogInfo?.upgrade} required />
                    </span>
                    <br />
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
            {editParams && ['entity', 'map'].map(
                field => <input type="hidden" name={`edited-${field}`} key={field} value={editParams.get(field) ?? undefined} />)}
            <input type="hidden" name="edit" value={doEdit} />
            <input type="submit" name="submit" value={doEdit ? "Update 2MP" : "Add 2MP"} />
        </form>
    </>
};

const AddTwoMP = withAuthenticationRequired(() => {
    return <ManipTwoMP />;
});

const EditTwoMP = withAuthenticationRequired(() => {
    const [params, setParams] = useSearchParams();
    if (!params.has('entity') || !params.has('map')) {
        return <PageTitle>Need to specify entity and map</PageTitle>;
    }
    return <ManipTwoMP editParams={params} setEditParams={setParams} />
});

export { AddTwoMP, EditTwoMP };
