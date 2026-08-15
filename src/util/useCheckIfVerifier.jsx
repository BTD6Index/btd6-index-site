import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from "react";

export default function useCheckIfVerifier() {
    const { isAuthenticated, isLoading, getIdTokenClaims } = useAuth0();

    const [isVerifier, setVerifier] = useState(false);

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            getIdTokenClaims().then((claims) => {
                setVerifier(claims?.['https://btd6index.win/roles']?.includes('Index Verifier') ?? false);
            });
        }
    }, [getIdTokenClaims, isLoading, isAuthenticated]);

    return isVerifier;
}