import Select from "react-select";
import selectStyle from "../../../util/selectStyle";
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { startingTowerToOptions, towerToOptions } from "../../../util/selectOptions";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import useCheckIfAdmin from "../../../util/useCheckIfAdmin";
import { useFetchExistingInfo, useSubmitCallback, AttachmentsWidget, FormLinkImageEntry} from "./manipCommon";
import MapSelect from "../../../util/MapSelect";
import PageTitle from "../../../util/PageTitle";

const FIELDS = ['tower1', 'tower2']; // needs to be outside so react doesn't treat value as changed every re-render

function ManipTwoTC({editParams = null, setEditParams = null}) {
    const [isOG, setOG] = useState(false);

    const {existingInfo, ogInfo, noteInfo, existingAttachments, forceReload} = useFetchExistingInfo({
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

    const [submissionInProgress, setSubmissionInProgress] = useState(false);

    const submitCallback = useSubmitCallback({
        formRef: theForm, challenge: '2tc', oldLink: existingInfo?.[0]?.link, setEditParams, forceReload,
        setSubmissionInProgress
    });

    const filteredTowerOptions = [...towerToOptions.values()].filter(({value}) => !['Sauda', 'Geraldo'].includes(value));
    const filteredStartingTowerOptions = [...startingTowerToOptions.values()].filter(({value}) => !['Sauda', 'Geraldo'].includes(value));


    const [map, setMap] = useState(null);
    useEffect(() => {
        setMap(existingInfo?.[0]?.map)
    }, [existingInfo]);

    return <>
        <p><a href="/2tc">Back to 2TCs</a></p>
        <PageTitle>{
        doEdit
        ? `Edit ${editParams.get('tower1')} and ${editParams.get('tower2')} 2TC on ${editParams.get('map')}`
        : "Add a 2TC Completion"}</PageTitle>
        <form method="post" encType="multipart/form-data" action="/member/add-2tc-submit" onSubmit={submitCallback} ref={theForm}>
            {(!doEdit || existingInfo?.[0]?.pending) && isAdmin ? <><span className="formLine">
                <label htmlFor="verify">Mark as verified?</label>
                <input type="checkbox" name="verify" />
            </span><br /></> : <input type="hidden" name="verify" value="on" />}
            <span className="formLine">
                <label htmlFor="tower1">Tower 1 (the first of the 2 towers obtained)</label>
                <Select name="tower1" options={filteredStartingTowerOptions} styles={selectStyle} defaultValue={
                    towerToOptions.get(editParams?.get('tower1')) ?? undefined
                    } required />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="tower2">Tower 2 (the second of the 2 towers obtained)</label>
                <Select name="tower2" options={filteredTowerOptions} styles={selectStyle} defaultValue={
                    towerToOptions.get(editParams?.get('tower2')) ?? undefined
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
                <input name="person" type="text" placeholder="Person" style={{width: '20ch'}} defaultValue={existingInfo?.[0]?.person} required />
            </span>
            <br />
            <FormLinkImageEntry existingInfo={existingInfo} />
            <br />
            <span className="formLine">
                <label htmlFor="notes">Completion Notes/Proof (Please specify challenge code here)</label>
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
            <input type="submit" name="submit" value={doEdit ? "Update 2TC" : "Add 2TC"} disabled={submissionInProgress} />
        </form>
    </>
};

const AddTwoTC = withAuthenticationRequired(() => {
    return <ManipTwoTC />;
});

const EditTwoTC = withAuthenticationRequired(() => {
    const [params, setParams] = useSearchParams();
    if (['tower1', 'tower2', 'map'].some(key => !params.has(key))) {
        return <PageTitle>Need to specify tower1, tower2, and map</PageTitle>;
    }
    return <ManipTwoTC editParams={params} setEditParams={setParams} />
});

export {AddTwoTC, EditTwoTC};
