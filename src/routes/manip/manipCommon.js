import { useAuth0 } from "@auth0/auth0-react";
import { useCallback } from "react";

function useSubmitCallback(formRef, challenge) {
    const { getAccessTokenWithPopup } = useAuth0();

    return useCallback((e) => {
        e.preventDefault();
        const formData = new FormData(formRef.current);
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
            }
        }).catch(error => {
            window.alert(`Error adding ${challenge}: ${error.message}`);
        });
    }, [getAccessTokenWithPopup, challenge, formRef]);
}

export { useSubmitCallback };