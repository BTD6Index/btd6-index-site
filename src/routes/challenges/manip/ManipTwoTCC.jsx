import Select from "react-select";
import selectStyle from "../../../util/selectStyle";
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { towerToOptions } from "../../../util/selectOptions";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import useCheckIfAdmin from "../../../util/useCheckIfAdmin";
import { useFetchExistingInfo, useSubmitCallback, FormLinkImageEntry, AttachmentsWidget} from "./manipCommon";
import MapSelect from "../../../util/MapSelect";

const FIELDS = ['tower1', 'tower2']; // needs to be outside so react doesn't treat value as changed every re-render

function ManipTwoTCC({editParams = null, setEditParams = null}) {
    const [isOG, setOG] = useState(false);

    const {existingInfo, ogInfo, noteInfo, existingAttachments, forceReload} = useFetchExistingInfo({
        editParams,
        fields: FIELDS,
        challenge: '2tcc'
    });

    const theForm = useRef();

    const isAdmin = useCheckIfAdmin();

    const doEdit = editParams !== null;

    useEffect(() => {
        setOG(!!existingInfo?.[0]?.og);
    }, [existingInfo]);

    const submitCallback = useSubmitCallback({
        formRef: theForm, challenge: '2tcc', oldLink: existingInfo?.[0]?.link, setEditParams, forceReload
    });

    const filteredTowerOptions = [...towerToOptions.values()];

    const [map, setMap] = useState(null);
    useEffect(() => {
        setMap(existingInfo?.[0]?.map)
    }, [existingInfo]);

    return <>
        <p><a href="/2tcc">Back to 2TCCs</a></p>
        <h1>{
        doEdit
        ? `Edit ${editParams.get('tower1')} and ${editParams.get('tower2')} 2TCC on ${editParams.get('map')}`
        : "Add a 2TCC Completion"}</h1>
        <form method="post" encType="multipart/form-data" action="/member/add-2tcc-submit" onSubmit={submitCallback} ref={theForm}>
            {(!doEdit || existingInfo?.[0]?.pending) && isAdmin ? <><span className="formLine">
                <label htmlFor="verify">Mark as verified?</label>
                <input type="checkbox" name="verify" />
            </span><br /></> : <input type="hidden" name="verify" value="on" />}
            <span className="formLine">
                <label htmlFor="tower1">Tower 1</label>
                <Select name="tower1" options={filteredTowerOptions} styles={selectStyle} defaultValue={
                    towerToOptions.get(editParams?.get('tower1')) ?? undefined
                    } required />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="tower2">Tower 2</label>
                <Select name="tower2" options={filteredTowerOptions} styles={selectStyle} defaultValue={
                    towerToOptions.get(editParams?.get('tower2')) ?? undefined
                    } required />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="map">Map</label>
                <MapSelect name="map" mapValue={map} required onChange={(val) => setMap(val.value)} />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="person1">Person 1</label>
                <input name="person1" type="text" placeholder="Person 1" style={{width: '20ch'}} defaultValue={existingInfo?.[0]?.person1} required />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="person2">Person 2</label>
                <input name="person2" type="text" placeholder="Person 2" style={{width: '20ch'}} defaultValue={existingInfo?.[0]?.person2} required />
            </span>
            <br />
            <FormLinkImageEntry existingInfo={existingInfo} />
            <br />
            <span className="formLine">
                <label htmlFor="notes">Completion Notes/Proof</label>
                <textarea name="notes" rows="5" cols="40" defaultValue={noteInfo?.notes}></textarea>
            </span>
            <br />
            <AttachmentsWidget existingAttachments={existingAttachments} />
            <br />
            <span className="formLine">
                <label htmlFor="og">OG Completion?</label>
                <input type="checkbox" name="og" onChange={e => setOG(e.target.checked)} checked={isOG} />
            </span>
            <br />
            {
                isOG && <>
                    <span className="formLine">
                        <label htmlFor="upgrade1">Tower 1 Upgrade</label>
                        <input name="upgrade1" type="text" placeholder="Upgrade 1" style={{width: '20ch'}} defaultValue={ogInfo?.upgrade1} required />
                    </span>
                    <br />
                    <span className="formLine">
                        <label htmlFor="upgrade2">Tower 2 Upgrade</label>
                        <input name="upgrade2" type="text" placeholder="Upgrade 2" style={{width: '20ch'}} defaultValue={ogInfo?.upgrade2} required />
                    </span>
                    <br />
                    <span className="formLine">
                        <label htmlFor="money">Starting Cash</label>
                        <input name="money" type="number" placeholder="Starting Cash" style={{width: '20ch'}} defaultValue={ogInfo?.money} required />
                    </span>
                    <br />
                    <span className="formLine">
                        <label htmlFor="version">Update</label>
                        <input name="version" type="text" placeholder="Update" style={{width: '20ch'}} defaultValue={ogInfo?.version} required />
                    </span>
                    <br />
                    <span className="formLine">
                        <label htmlFor="date">Completion Date</label>
                        <input name="date" type="date" placeholder="Completion Date" style={{width: '20ch'}} defaultValue={ogInfo?.date} required />
                    </span>
                    <br />
                </>
            }
            {editParams && ['tower1', 'tower2', 'map'].map(
                field => <input type="hidden" name={`edited-${field}`} key={field} value={editParams.get(field) ?? undefined} />)}
            <input type="hidden" name="edit" value={doEdit} />
            <input type="submit" name="submit" value={doEdit ? "Update 2TCC" : "Add 2TCC"} />
        </form>
    </>
};

const AddTwoTCC = withAuthenticationRequired(() => {
    return <ManipTwoTCC />;
});

const EditTwoTCC = withAuthenticationRequired(() => {
    const [params, setParams] = useSearchParams();
    if (['tower1', 'tower2', 'map'].some(key => !params.has(key))) {
        return <h1>Need to specify tower1, tower2, and map</h1>;
    }
    return <ManipTwoTCC editParams={params} setEditParams={setParams} />
});

export {AddTwoTCC, EditTwoTCC};
