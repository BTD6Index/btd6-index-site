import { useAuth0 } from "@auth0/auth0-react";
import { useCallback, useState, useEffect } from "react";
import { imageObjectRegex } from "../../../util/imageObjectRegex";

function useSubmitCallback({formRef, challenge, oldLink, setEditParams}) {
    const { getAccessTokenWithPopup } = useAuth0();

    return useCallback((e) => {
        e.preventDefault();
        const formData = new FormData(formRef.current);
        if (imageObjectRegex.exec(formData.get('link') ?? '') && formData.get('link') !== oldLink) {
            alert('You cannot reference a media.btd6index.win image from a different completion');
            return;
        }
        getAccessTokenWithPopup({
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
                    setEditParams(newParams, {replace: true});
                }
            }
        }).catch(error => {
            window.alert(`Error adding ${challenge}: ${error.message}`);
        });
    }, [getAccessTokenWithPopup, challenge, formRef, oldLink, setEditParams]);
}

function useFetchExistingInfo({editParams, fields, challenge}) {
    const [existingInfo, setExistingInfo] = useState(null);
    const [ogInfo, setOGInfo] = useState(null);
    const [noteInfo, setNoteInfo] = useState(null);

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
                }
            });
        }
    }, [editParams, doEdit, challenge, fields]);

    return {existingInfo, ogInfo, noteInfo};
}

const IMAGE_FORMATS = "image/jpeg, image/png, image/gif, image/webp, image/apng, video/webm, video/ogg, video/mp4";

export { useSubmitCallback, useFetchExistingInfo, IMAGE_FORMATS };