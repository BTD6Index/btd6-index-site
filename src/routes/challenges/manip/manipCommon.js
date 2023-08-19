import { useCallback, useState, useEffect, Fragment } from "react";
import { imageObjectRegex } from "../../../util/imageObjectRegex";
import useAccessToken from "../../../util/useAccessToken";

function useSubmitCallback({formRef, challenge, oldLink, setEditParams, forceReload}) {
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
                audience: 'https://btd6index.win/'
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
                            newParams[dataKey.substring(7)] = formData.get(dataKey.substring(7));
                        }
                    }
                    forceReload();
                    setEditParams(newParams, {replace: true});
                }
            }
        }).catch(error => {
            window.alert(`Error adding ${challenge}: ${error.message}`);
        });
    }, [getToken, challenge, formRef, oldLink, setEditParams, forceReload]);
}

function useFetchExistingInfo({editParams, fields, challenge}) {
    const [existingInfo, setExistingInfo] = useState(null);
    const [ogInfo, setOGInfo] = useState(null);
    const [noteInfo, setNoteInfo] = useState(null);
    const [existingAttachments, setExistingAttachments] = useState(null);
    const [_reloadVar, _setReloadVar] = useState(false);

    const doEdit = editParams !== null;

    useEffect(() => {
        if (doEdit) {
            fetch(`/fetch-${challenge}?` + new URLSearchParams(
                fields.concat(['map']).map(field => [field, editParams.get(field)])
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
                        fields.concat(['map']).map(field => [field, editParams.get(field)])
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
    }, [editParams, doEdit, challenge, fields, _reloadVar]);

    const forceReload = useCallback(() => {
        _setReloadVar(state => !state);
    }, []);

    return {existingInfo, ogInfo, noteInfo, existingAttachments, forceReload};
}

const IMAGE_FORMATS = "image/jpeg, image/png, image/gif, image/webp, image/apng, video/webm, video/ogg, video/mp4";

function FormLinkEntry({existingInfo}) {
    return <span className="formLine">
                <label htmlFor="link">Link (leave blank to use potentially already-uploaded image/video)</label>
                <input name="link" type="text" placeholder="Link" style={{ width: '14ch' }} defaultValue={existingInfo?.[0]?.link} />
            </span>;
}

function AttachmentsWidget({existingAttachments, attachmentsLabel = null}) {
    return <>
        <span className="formLine">
            <label htmlFor="attachments">{attachmentsLabel ?? "Upload Attachments"}</label>
            <input type="file" name="attachments" accept={IMAGE_FORMATS} multiple />
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

export { useSubmitCallback, useFetchExistingInfo, IMAGE_FORMATS, FormLinkEntry, AttachmentsWidget };