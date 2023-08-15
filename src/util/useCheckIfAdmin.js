import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from "react";

export default function useCheckIfAdmin() {
    const { isAuthenticated, isLoading, getIdTokenClaims } = useAuth0();

    const [isAdmin, setAdmin] = useState(false);

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            getIdTokenClaims().then((claims) => {
                setAdmin(claims?.['https://btd6index.win/roles']?.includes('Index Helper') ?? false);
            });
        }
    }, [getIdTokenClaims, isLoading, isAuthenticated]);

    return isAdmin;
}