import Select from "react-select";
import selectStyle from "../../../util/selectStyle";
import { useEffect, useRef, useState, useCallback, Fragment } from "react";
import { useSearchParams } from "react-router-dom";
import { towerToOptions } from "../../../util/selectOptions";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import useCheckIfAdmin from "../../../util/useCheckIfAdmin";
import { AttachmentsWidget, FormLinkImageEntry, useSubmitCallback } from "./manipCommon";
import useForceReload from "../../../util/useForceReload";
import MapSelect from "../../../util/MapSelect";

function CompletionTypeWidget({existingInfo}) {
    const [completionType, setCompletionType] = useState();

    useEffect(() => setCompletionType(existingInfo?.[0]?.completiontype ?? 'og'), [existingInfo]);

    const changeHandler = useCallback(e => setCompletionType(e.target.value), []);

    return <span className="formLine">
        <label htmlFor="completiontype">Completion Type</label>
        <span className="formSubLine">
            <input type="radio" value="og" name="completiontype" id="completiontype-og"
            checked={completionType === 'og'} onChange={changeHandler} />
            <label htmlFor="completiontype-og">OG</label>
        </span>
        <span className="formSubLine">
            <input type="radio" value="cheapest" name="completiontype" id="completiontype-cheapest"
            checked={completionType === 'cheapest'} onChange={changeHandler} />
            <label htmlFor="completiontype-cheapest">Cheapest</label>
        </span>
    </span>
}

function ManipLTC({ editParams = null, setEditParams = null }) {
    const [existingInfo, setExistingInfo] = useState(null);
    const [existingAttachments, setExistingAttachments] = useState(null);
    const {reloadVar, forceReload} = useForceReload();

    const doEdit = editParams !== null;

    useEffect(() => {
        if (doEdit) {
            fetch('/fetch-ltc?' + new URLSearchParams(
                ['map', 'towerset', 'completiontype']
                .flatMap(field => {
                    const fieldVal = editParams?.get(field);
                    if (fieldVal === null || fieldVal === undefined) {
                        return [];
                    } else {
                        return [[field, fieldVal]];
                    }
                })
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
        formRef: theForm, challenge: 'ltc', oldLink: existingInfo?.[0]?.link, setEditParams, forceReload
    });

    const getInitialTowersetList = useCallback(
        () => editParams?.get('towerset') ? JSON.parse(editParams?.get('towerset')) : null,
        [editParams]
    );
    const getInitialUpgradesetList = useCallback(
        () => {
            const upgradeset = existingInfo?.[0]?.upgradeset;
            return upgradeset ? JSON.parse(upgradeset) : null;
        },
        [existingInfo]
    );
    const initialTowersetList = getInitialTowersetList();
    //const initialUpgradesetList = getInitialUpgradesetList();

    const [numTowers, setNumTowers] = useState(0);
    // [{tower: <tower>, upgrade: <upgrade>}, ...]
    const [towerAndUpgradeSets, setTowerAndUpgradeSets] = useState([]);
    useEffect(
        () => {
            const initialTowersetList = getInitialTowersetList();
            const initialUpgradesetList = getInitialUpgradesetList();
            setNumTowers(initialTowersetList?.length ?? 0);
            setTowerAndUpgradeSets(initialTowersetList?.map((tower, idx) => {
                return {tower, upgrade: initialUpgradesetList?.[idx]};
            }) ?? []);
        },
        [getInitialTowersetList, getInitialUpgradesetList]
    );

    useEffect(() => {
        setTowerAndUpgradeSets(state => {
            let result = [...state.slice(0, numTowers)]
            for (let i=0; i<numTowers - state.length; ++i) {
                result.push({tower: null, upgrade: null});
            }
            return result;
        });
    }, [numTowers]);

    const [map, setMap] = useState(null);
    useEffect(() => {
        setMap(existingInfo?.[0]?.map)
    }, [existingInfo]);

    return <>
        <p><a href="/ltc">Back to LTCs</a></p>
        <h1>{doEdit ? `Edit (${initialTowersetList.join(', ')}) LTC on ${editParams.get('map')}` : "Add an LTC Completion"}</h1>
        <form method="post" encType="multipart/form-data" action="/member/add-ltc-submit" onSubmit={submitCallback} ref={theForm}>
            {(!doEdit || existingInfo?.[0]?.pending) && isAdmin ? <><span className="formLine">
                <label htmlFor="verify">Mark as verified?</label>
                <input type="checkbox" name="verify" />
            </span><br /></> : <input type="hidden" name="verify" value="on" />}
            <span className="formLine">
                <label htmlFor="num_towers">Number of Towers</label>
                <input id="num_towers" type="number" min={0} value={numTowers} onChange={e => setNumTowers(e.target.valueAsNumber)} />
                {
                    Array.from({length: numTowers}, (_dummy, idx) => {
                        const onTowerChange = (newVal) => {
                            setTowerAndUpgradeSets(state => {
                                let newState = structuredClone(state);
                                newState[idx].tower = newVal.value;
                                return newState;
                            });
                        };
                        const onUpgradeChange = (event) => {
                            setTowerAndUpgradeSets(state => {
                                let newState = structuredClone(state);
                                newState[idx].upgrade = event.target.value;
                                return newState;
                            });
                        };

                        return <Fragment key={idx}>
                            <label htmlFor={`tower_${idx}`}>Tower {idx+1}</label>
                            <Select inputId={`tower_${idx}`} options={[...towerToOptions.values()]} styles={selectStyle}
                            value={towerToOptions?.get(towerAndUpgradeSets?.[idx]?.tower) ?? null}
                            onChange={onTowerChange} required />
                            <label htmlFor={`upgrade_${idx}`}>Upgrade {idx+1}</label>
                            <input id={`upgrade_${idx}`} type='text' value={towerAndUpgradeSets?.[idx]?.upgrade ?? ''}
                            onChange={onUpgradeChange} />
                        </Fragment>;
                    })
                }
                <input type="hidden" name="towerset" value={
                    JSON.stringify(towerAndUpgradeSets.map(({tower}) => tower))
                } />
                <input type="hidden" name="upgradeset" value={
                    JSON.stringify(towerAndUpgradeSets.map(({upgrade}) => upgrade))
                } />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="map">Map</label>
                <MapSelect name="map" mapValue={map} required onChange={(val) => setMap(val.value)} />
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
            <CompletionTypeWidget existingInfo={existingInfo} />
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
            {editParams && ['map', 'towerset', 'completiontype'].map(
                field => <input type="hidden" name={`edited-${field}`} key={field} value={editParams.get(field) ?? undefined} />)}
            <input type="hidden" name="edit" value={doEdit} />
            <input type="submit" name="submit" value={doEdit ? "Update LTC" : "Add LTC"} />
        </form>
    </>
};

const AddLTC = withAuthenticationRequired(() => {
    return <ManipLTC />;
});

const EditLTC = withAuthenticationRequired(() => {
    const [params, setParams] = useSearchParams();
    if (!params.has('towerset') || !params.has('map')) {
        return <h1>Need to specify map and towerset</h1>;
    }
    return <ManipLTC editParams={params} setEditParams={setParams} />
});

export { AddLTC, EditLTC };
