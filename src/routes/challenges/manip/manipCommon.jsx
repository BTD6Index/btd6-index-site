import { useCallback, useState, useEffect, Fragment } from "react";
//import { imageObjectRegex } from "../../../../functions/imageObjectRegex.js";
import { imageObjectRegex } from "../../../util/imageObjectRegex";
import useAccessToken from "../../../util/useAccessToken";
import useForceReload from "../../../util/useForceReload";
import towers from '../../../util/tower-names.json' with { type: 'json' };
function stringifyValues(obj) {
    if (obj === null) return null;

    // If it's an array, map over its items recursively
    if (ArrayArray(obj)) {
        return obj.map(stringifyValues);
    }

    // If it's an object, map over its keys recursively
    if (typeof obj === 'object') {
        return Object.fromEntries(
            Object.entries(obj).map(([key, val]) => [key, stringifyValues(val)])
        );
    }

    // Convert primitive values directly to a string
    return String(obj);
}
function useSubmitCallback({ formRef, challenge, oldLink, setEditParams, forceReload: forceReloadVar, setSubmissionInProgress }) {
    const getToken = useAccessToken();

    return useCallback(async (e) => {
        e.preventDefault();
        const formData = new FormData(formRef.current);
        if (formData.get("code") != "") {
            const code = formData.get("code");
            formData.set("notes", code + "\n" + formData.get("notes"));
            formData.delete("code");
            let result = await fetch("https://data.ninjakiwi.com/btd6/challenges/challenge/" + code.toUpperCase());
            let data = JSON.parse(await result.text(), (key, value) => {
                if (value !== null && typeof value !== 'object') {
                    return String(value);
                }
                return value;
            });

            if (data.body == null) {
                alert("Challenge code is invalid");
            }
            else {
                data = data.body;
                switch (data.map) {
                    case "Tutorial":
                        data.map = "monkeymeadow";
                        break;
                    case "TownCentre":
                        data.map = "towncenter";
                        break;
                    case "ThreeMinesAround":
                        data.map = "ThreeMinesRound";
                        break;
                }
                data._towers[8].tower = "Pat";
                data._towers[2].tower = "Gwen";
                data._towers[3].tower = "Jones";
                data._towers[4].tower = "Obyn";
                data._towers[5].tower = "Churchill";
                data._towers[10].tower = "Brickell";
                data._towers[18].tower = "Dan";
                let mapcheck = data.map.toLowerCase() == formData.get("map").replaceAll(" ", "").replaceAll("\'", "").toLowerCase(), restrictioncheck = true,
                    rulescheck = data.mode == "Clicks" && data.disableSelling && data.startingCash == 650 && data.startRound == 6 && data.endRound == 100 && data.lives == 1 && data.abilityCooldownReductionMultiplier == 1 && data.removeableCostMultiplier == 1 && data.roundSets.length == 1 && data.roundSets[0] == "default" && data._bloonModifiers.allCamo == "false" && data._bloonModifiers.allRegen == "false" && data._bloonModifiers.moabSpeedMultiplier == 1 && data._bloonModifiers.speedMultiplier == 1 && data._bloonModifiers.regrowRateMultiplier == 1 && data._bloonModifiers.healthMultipliers["bloons"] == 1 && data._bloonModifiers.healthMultipliers["moabs"] == 1 && data._towers[0].max == 0;

                let tower1 = formData.get("tower1").replaceAll(" ", "").replaceAll("-", ""), tower2 = formData.get("tower2").replaceAll(" ", "").replaceAll("-", ""), upgrade1 = "", upgrade2 = "";


                for (const [k, v] of Object.entries(towers)) {

                    for (let [key, value] of Object.entries(v)) {

                        if (value.replaceAll(" ", "").replaceAll("-", "") == tower1) {
                            upgrade1 = key;
                            tower1 = k.replaceAll(" ", "").replaceAll("-", "");
                        }
                        if (value.replaceAll(" ", "").replaceAll("-", "") == tower2) {
                            upgrade2 = key;
                            tower2 = k.replaceAll(" ", "").replaceAll("-", "");
                        }
                    }

                }

                for (const towerRestriction of data._towers) {

                    if (towerRestriction.max == 2) {
                        if (tower1 == tower2 && towerRestriction.tower == tower1) {

                        }
                        else {
                            restrictioncheck = false;
                            break;
                        }
                    }

                    if (Math.abs(towerRestriction.max) == 1) {
                        
                        if (towerRestriction.tower == tower1) {

                            if (towerRestriction.isHero)
                                continue;

                            var path = Math.max(upgrade1.indexOf('3'), Math.max(upgrade1.indexOf('4'), upgrade1.indexOf('5'))) + 1;

                            const valid = [3, 4, 5, -1];
                            if (path == 0) {
                                if (valid.indexOf(towerRestriction.path1NumBlockedTiers) == -1 || valid.indexOf(towerRestriction.path2NumBlockedTiers) == -1 || valid.indexOf(towerRestriction.path3NumBlockedTiers) == -1) {
                                    restrictioncheck = false;
                                    break;
                                }
                            }
                            else {
                                if (path == 1) {

                                    if (!((upgrade1[path - 1] + towerRestriction.path1NumBlockedTiers >= 5 || towerRestriction.path1NumBlockedTiers == -1) && valid.indexOf(towerRestriction.path2NumBlockedTiers) != -1 && valid.indexOf(towerRestriction.path3NumBlockedTiers) != -1)) {
                                        restrictioncheck = false;
                                        break;
                                    }

                                }
                                if (path == 2) {

                                    if (!((upgrade1[path - 1] + towerRestriction.path2NumBlockedTiers >= 5 || towerRestriction.path2NumBlockedTiers == -1) && valid.indexOf(towerRestriction.path1NumBlockedTiers) != -1 && valid.indexOf(towerRestriction.path3NumBlockedTiers) != -1)) {
                                        restrictioncheck = false;
                                        break;
                                    }

                                }
                                if (path == 3) {

                                    if (!((upgrade1[path - 1] + towerRestriction.path3NumBlockedTiers >= 5 || towerRestriction.path3NumBlockedTiers == -1) && valid.indexOf(towerRestriction.path1NumBlockedTiers) != -1 && valid.indexOf(towerRestriction.path2NumBlockedTiers) != -1)) {
                                        restrictioncheck = false;
                                        break;
                                    }

                                }
                            }
                        }
                        else if (towerRestriction.tower == tower2) {
                            if (towerRestriction.isHero)
                                continue;

                            var path = Math.max(upgrade2.indexOf('3'), Math.max(upgrade2.indexOf('4'), upgrade2.indexOf('5'))) + 1;

                            const valid = [3, 4, 5, -1];
                            if (path == 0) {
                                if (valid.indexOf(towerRestriction.path1NumBlockedTiers) == -1 || valid.indexOf(towerRestriction.path2NumBlockedTiers) == -1 || valid.indexOf(towerRestriction.path3NumBlockedTiers) == -1) {
                                    restrictioncheck = false;
                                    break;
                                }
                            }
                            else {
                                if (path == 1) {

                                    if (!((upgrade2[path - 1] + towerRestriction.path1NumBlockedTiers >= 5 || towerRestriction.path1NumBlockedTiers == -1) && valid.indexOf(towerRestriction.path2NumBlockedTiers) != -1 && valid.indexOf(towerRestriction.path3NumBlockedTiers) != -1)) {
                                        restrictioncheck = false;
                                        break;
                                    }

                                }
                                if (path == 2) {

                                    if (!((upgrade2[path - 1] + towerRestriction.path2NumBlockedTiers >= 5 || towerRestriction.path2NumBlockedTiers == -1) && valid.indexOf(towerRestriction.path1NumBlockedTiers) != -1 && valid.indexOf(towerRestriction.path3NumBlockedTiers) != -1)) {
                                        restrictioncheck = false;
                                        break;
                                    }

                                }
                                if (path == 3) {

                                    if (!((upgrade2[path - 1] + towerRestriction.path3NumBlockedTiers >= 5 || towerRestriction.path3NumBlockedTiers == -1) && valid.indexOf(towerRestriction.path1NumBlockedTiers) != -1 && valid.indexOf(towerRestriction.path2NumBlockedTiers) != -1)) {
                                        restrictioncheck = false;
                                        break;
                                    }

                                }
                            }
                        }
                        else {
                            restrictioncheck = false;
                            break;
                        }
                    }
                }


                if (!rulescheck || !mapcheck || !restrictioncheck) {
                    alert("Challenge settings invalid.\nMake sure you disabled selling and restricted towers correctly\n" + (!mapcheck ? "Map error (very likely wrong code)\n" : "") + (!rulescheck ? "Challenge rules " : "") + (!restrictioncheck ? "Restriction " : "") + "error");
                    return;
                }
                else if (formData.has("og") && formData.get("og") != "on") {
                    formData.set("verify", "on");
                }

            }
        }
        if (imageObjectRegex.exec(formData.get('link') ?? '') && formData.get('link') !== oldLink) {
            alert('You cannot reference a media.btd6index.win image from a different completion');
            return;
        }
        setSubmissionInProgress(true);
        getToken({
            authorizationParams: {
                audience: 'https://btd6index.win/',
                scope: 'openid email profile offline_access'
            }
        }).then(async (token) => {
            let result = await fetch(formRef.current.action, {
                method: 'post',
                body: formData,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            result = await result.json();
            if ('error' in result) {
                throw new Error(result.error);
            } else {
                window.alert(result.inserted ? `Successfully registered ${challenge}` : `${challenge} already exists`);
                if (setEditParams) {
                    let newParams = {};
                    for (let dataKey of formData.keys()) {
                        if (dataKey.startsWith('edited-')) {
                            newParams[dataKey.substring(7)] = formData.get(dataKey.substring(7)) ?? formData.get(dataKey);
                        }
                    }
                    forceReloadVar();
                    setEditParams(newParams, { replace: true });
                }
            }
        }).catch(error => {
            window.alert(`Error adding ${challenge}: ${error.message}`);
        }).finally(() => {
            setSubmissionInProgress(false);
        });
    }, [formRef, oldLink, setSubmissionInProgress, getToken, challenge, setEditParams, forceReloadVar]);
}

const DEFAULT_ALT_FIELDS = ['map'];

function useFetchExistingInfo({ editParams, fields, altFields = DEFAULT_ALT_FIELDS, challenge }) {
    const [existingInfo, setExistingInfo] = useState(null);
    const [ogInfo, setOGInfo] = useState(null);
    const [noteInfo, setNoteInfo] = useState(null);
    const [existingAttachments, setExistingAttachments] = useState(null);
    const { reloadVar, forceReload } = useForceReload();

    const doEdit = editParams !== null;

    useEffect(() => {
        if (doEdit) {
            fetch(`/fetch-${challenge}?` + new URLSearchParams(
                fields.concat(altFields).map(field => [field, editParams.get(field)])
            ))
                .then(async (res) => {
                    let json = await res.json();
                    if ('error' in json) {
                        setExistingInfo(null);
                    } else {
                        setExistingInfo(json.results);
                        if (json.results?.[0]?.og) {
                            let ogRes = await fetch(`/fetch-${challenge}-og-info?` + new URLSearchParams(
                                fields.map(field => [field, editParams.get(field)])
                            ));
                            let ogJson = await ogRes.json();
                            if ('error' in ogJson) {
                                setOGInfo(null);
                            } else {
                                setOGInfo(ogJson.result);
                            }
                        }
                        let notesRes = await fetch(`/fetch-${challenge}-notes?` + new URLSearchParams(
                            fields.concat(altFields).map(field => [field, editParams.get(field)])
                        ));
                        let notesJson = await notesRes.json();
                        if ('error' in notesJson) {
                            setNoteInfo(null);
                        } else {
                            setNoteInfo(notesJson);
                        }
                        let attachmentsRes = await fetch(`/list-attachments?` + new URLSearchParams([
                            ['key', json.results?.[0]?.filekey]
                        ]));
                        setExistingAttachments((await attachmentsRes.json()).files);
                    }
                });
        }
    }, [editParams, doEdit, challenge, fields, altFields, reloadVar]);

    return { existingInfo, ogInfo, noteInfo, existingAttachments, forceReload };
}

const IMAGE_FORMATS = "image/jpeg, image/png, image/gif, image/webp, image/apng, video/webm, video/ogg, video/mp4";

function FormLinkEntry({ existingInfo }) {
    return <span className="formLine">
        <label htmlFor="link">Link</label>
        <input name="link" id="link" type="text" placeholder="Link" style={{ width: '20ch' }} defaultValue={existingInfo?.[0]?.link} />
    </span>;
}

function FormImageEntry() {
    return <span className="formLine">
        <label htmlFor="image">Upload Image/Video</label>
        <input type="file" name="image" id="image" accept={IMAGE_FORMATS} />
    </span>;
}

function FormLinkImageEntry({ existingInfo }) {
    const [linkType, setLinkType] = useState('image');

    useEffect(() => {
        setLinkType(existingInfo?.[0]?.link ? 'link' : 'image');
    }, [existingInfo]);

    const optionChange = useCallback(e => {
        setLinkType(e.target.value);
    }, []);

    return <>
        <span className="formLine">
            <span>Submission Type</span>
            <span className="formSubLine"><input type="radio" id="linktype-image" value="image"
                onChange={optionChange} checked={linkType === 'image'} />
                <label htmlFor="linktype-image">Image/Video</label></span>
            <span className="formSubLine"><input type="radio" id="linktype-link" value="link"
                onChange={optionChange} checked={linkType === 'link'} />
                <label htmlFor="linktype-link">Link</label></span>
        </span>
        <br />
        {linkType === 'image' && <FormImageEntry />}
        {linkType === 'link' && <FormLinkEntry existingInfo={existingInfo} />}
    </>;
}

function AttachmentsWidget({ existingAttachments, attachmentsLabel = null }) {
    return <>
        <span className="formLine">
            <label htmlFor="attachments">{attachmentsLabel ?? "Upload Attachments"}</label>
            <input type="file" name="attachments" id="attachments" accept={IMAGE_FORMATS} multiple />
        </span>
        {
            (existingAttachments ?? []).map(attachmentKey => {
                const link = `https://media.btd6index.win/${attachmentKey}`;
                return <Fragment key={attachmentKey}>
                    <br />
                    <span className="formLine">
                        <label htmlFor={`delete-attachment-${attachmentKey}`}>Delete attachment <a href={link}>{link}</a>?</label>
                        <input id={`delete-attachment-${attachmentKey}`} type="checkbox" name="delete-attachments" value={attachmentKey} />
                    </span>
                </Fragment>;
            })
        }
    </>;
}

export { useSubmitCallback, useFetchExistingInfo, IMAGE_FORMATS, FormLinkImageEntry, AttachmentsWidget };
