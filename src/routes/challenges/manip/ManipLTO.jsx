import Select from "react-select";
import selectStyle from "../../../util/selectStyle";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { towerTypeAndHeroToOptions } from "../../../util/selectOptions";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import useCheckIfAdmin from "../../../util/useCheckIfAdmin";
import { AttachmentsWidget, FormLinkImageEntry, useFetchExistingInfo, useSubmitCallback } from "./manipCommon";
import OdysseySelect from "../../../util/OdysseySelect";
import PageTitle from "../../../util/PageTitle";

const FIELDS = ['odyssey']; // needs to be outside so react doesn't treat value as changed every re-render
const ALT_FIELDS = ['towerset'];

function ManipLTO({ editParams = null, setEditParams = null }) {
    const [isOG, setOG] = useState(false);
    const [options, setOptions] = useState([...towerTypeAndHeroToOptions.values()]);

    const {existingInfo, ogInfo, noteInfo, existingAttachments, forceReload} = useFetchExistingInfo({
        editParams,
        fields: FIELDS,
        altFields: ALT_FIELDS,
        challenge: 'lto'
    });

    useEffect(() => {
        setOG(!!existingInfo?.[0]?.og);
    }, [existingInfo]);

    const theForm = useRef();

    const isAdmin = useCheckIfAdmin();

    const doEdit = editParams !== null;

    const submitCallback = useSubmitCallback({
        formRef: theForm, challenge: 'lto', oldLink: existingInfo?.[0]?.link, setEditParams, forceReload
    });

    const towersetList = editParams?.get('towerset') ? JSON.parse(editParams?.get('towerset')) : []

    const [towersetValue, setTowersetValue] = useState(JSON.stringify(towersetList));

    const [odyssey, setOdyssey] = useState(null);
    useEffect(() => {
        setOdyssey(existingInfo?.[0]?.odysseyName)
    }, [existingInfo]);

    return <>
        <p><a href="/lto">Back to LTOs</a></p>
        <PageTitle>{doEdit ? `Edit (${towersetList.join(', ')}) LTO for ${editParams.get('odysseyName')}` : "Add an LTO Completion"}</PageTitle>
        <form method="post" encType="multipart/form-data" action="/member/add-lto-submit" onSubmit={submitCallback} ref={theForm}>
            {(!doEdit || existingInfo?.[0]?.pending) && isAdmin ? <><span className="formLine">
                <label htmlFor="verify">Mark as verified?</label>
                <input type="checkbox" name="verify" />
            </span><br /></> : <input type="hidden" name="verify" value="on" />}
            <span className="formLine">
                <label htmlFor="odyssey">Odyssey</label>
                <OdysseySelect name="odyssey" inputId="odyssey" odysseyValue={odyssey} required onChange={(val) => setOdyssey(val.value)} />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="towerset">Towers</label>
                <Select
                    isMulti
                    options={options}
                    styles={selectStyle}
                    defaultValue={towersetList.map(towerType => towerTypeAndHeroToOptions.get(towerType))}
                    required 
                    onChange={useCallback((newValue, option) => {
                        if (option.action === "select-option") {
                            setOptions(o => [ ...o, {value: option.option.value + "_" + Date.now(), label: option.option.label}])
                        }
                        if (option.action === "clear"){
                            setOptions([...towerTypeAndHeroToOptions.values()]);
                        }
                        setTowersetValue(JSON.stringify(newValue.map(val => val.label)));
                    }, [])}
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
            {editParams && ['odyssey', 'towerset'].map(
                field => <input type="hidden" name={`edited-${field}`} key={field} value={editParams.get(field) ?? undefined} />)}
            <input type="hidden" name="edit" value={doEdit} />
            <input type="submit" name="submit" value={doEdit ? "Update LTO" : "Add LTO"} />
        </form>
    </>
};

const AddLTO = withAuthenticationRequired(() => {
    return <ManipLTO />;
});

const EditLTO = withAuthenticationRequired(() => {
    const [params, setParams] = useSearchParams();
    if (!params.has('towerset') || !params.has('odysseyName')) {
        return <PageTitle>Need to specify Odyssey Name and Towerset</PageTitle>;
    }
    return <ManipLTO editParams={params} setEditParams={setParams} />
});

export { AddLTO , EditLTO};
