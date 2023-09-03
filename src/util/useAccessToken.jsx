import { useAuth0 } from "@auth0/auth0-react";

export default function useAccessToken() {
    const {getAccessTokenSilently, getAccessTokenWithPopup} = useAuth0();
    return window.location.hostname.endsWith('btd6index.win') ? getAccessTokenSilently : getAccessTokenWithPopup;
}