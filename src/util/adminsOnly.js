import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { useEffect, useState } from "react";

const adminsOnly = (Component) => withAuthenticationRequired(() => {
    const { getIdTokenClaims } = useAuth0();
    const [isAdmin, setAdmin] = useState(undefined);
    useEffect(() => {
        getIdTokenClaims().then(token => {
            setAdmin(token?.['https://btd6index.win/roles']?.includes('Index Helper') ?? false);
        });
    }, [getIdTokenClaims]);
    if (isAdmin === undefined) {
        return <h1>Loading...</h1>;
    } else if (isAdmin === true) {
        return <Component />;
    } else {
        return <h1>You must be an index helper to access this page.</h1>;
    }
});

export default adminsOnly;
