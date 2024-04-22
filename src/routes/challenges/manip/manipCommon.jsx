import { useCallback, useState, useEffect, Fragment } from "react";
//imageObjectRegex.jsx blanked, and line 3 changed from import { imageObjectRegex } from "../../../util/imageObjectRegex"; to import { imageObjectRegex } from "../../../../functions/imageObjectRegex.js"; to allow site to load locally
import { imageObjectRegex } from "../../../../functions/imageObjectRegex.js";
import useAccessToken from "../../../util/useAccessToken";
import useForceReload from "../../../util/useForceReload";

function useSubmitCallback({formRef, challenge, oldLink, setEditParams, forceReload: forceReloadVar}) {
    const getToken = useAccessToken();

    return useCallback((e) => {
        e.preventDefault();
        const formData = new FormData(formRef.current);
        if (imageObjectRegex.exec(formData.get('link') ?? '') && formData.get('link') !== oldLink) {
            alert('You cannot reference a media.btd6index.win image from a different completion');
            return;
        }
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
                    setEditParams(newParams, {replace: true});
                }
            }
        }).catch(error => {
            window.alert(`Error adding ${challenge}: ${error.message}`);
        });
    }, [getToken, challenge, formRef, oldLink, setEditParams, forceReloadVar]);
}

const DEFAULT_ALT_FIELDS = ['map'];

function useFetchExistingInfo({editParams, fields, altFields = DEFAULT_ALT_FIELDS, challenge}) {
    const [existingInfo, setExistingInfo] = useState(null);
    const [ogInfo, setOGInfo] = useState(null);
    const [noteInfo, setNoteInfo] = useState(null);
    const [existingAttachments, setExistingAttachments] = useState(null);
    const {reloadVar, forceReload} = useForceReload();

    const doEdit = editParams !== null;

    useEffect(() => {
        if (doEdit) {
            fetch(`/fetch-${challenge}?` + new URLSearchParams(
                fields.concat(altFields).map(field => [field, editParams.get(field)])
                ))
            .then(async (res) => {
                let json = await res.json();
                if ('error' in json) {
                    console.log(json.error);
                    setExistingInfo(null);
                } else {
                    setExistingInfo(json.results);
                    if (json.results?.[0]?.og) {
                        let ogRes = await fetch(`/fetch-${challenge}-og-info?` + new URLSearchParams(
                            fields.map(field => [field, editParams.get(field)])
                        ));
                        let ogJson = await ogRes.json();
                        if ('error' in ogJson) {
                            console.log(ogJson.error);
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
                        console.log(notesJson.error);
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

    return {existingInfo, ogInfo, noteInfo, existingAttachments, forceReload};
}

const IMAGE_FORMATS = "image/jpeg, image/png, image/gif, image/webp, image/apng, video/webm, video/ogg, video/mp4";

function FormLinkEntry({existingInfo}) {
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

function FormLinkImageEntry({existingInfo}) {
    const [linkType, setLinkType] = useState('image');

    useEffect(() => {
        setLinkType(existingInfo?.[0]?.link ? 'link' : 'image');
    }, [existingInfo]);

    const optionChange = useCallback(e => {
        setLinkType(e.target.value);
    }, []);

    return <>
        <span className="formLine">
            <label htmlFor="linktype">Submission Type</label>
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

function AttachmentsWidget({existingAttachments, attachmentsLabel = null}) {
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
                        <label htmlFor="delete-attachments">Delete attachment <a href={link}>{link}</a>?</label>
                        <input type="checkbox" name="delete-attachments" value={attachmentKey} />
                    </span>
                </Fragment>;
            })
        }
    </>;
}

export { useSubmitCallback, useFetchExistingInfo, IMAGE_FORMATS, FormLinkImageEntry, AttachmentsWidget };