import { useAuth0 } from "@auth0/auth0-react";

export default function useAccessToken() {
    const {getAccessTokenSilently, getAccessTokenWithPopup} = useAuth0();
    return window.location.hostname.endsWith('btd6index.win')
    ? async (tokenParams) => {
        try {
            return await getAccessTokenSilently(tokenParams);
        } catch (e) {
            if (e.error === 'login_required' || e.error === 'consent_required') {
                return await getAccessTokenWithPopup();
            }
            throw e;
        }
    }
    : getAccessTokenWithPopup;
}