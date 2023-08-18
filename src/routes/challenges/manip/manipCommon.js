import { useAuth0 } from "@auth0/auth0-react";
import { useCallback } from "react";
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

export { useSubmitCallback };