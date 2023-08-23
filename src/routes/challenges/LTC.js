import useIndexSearch from "../../util/useIndexSearch";
import { useAuth0 } from "@auth0/auth0-react";
import useToggleList from "../../util/useToggleList";
import useAccessToken from "../../util/useAccessToken";
import useCheckIfAdmin from "../../util/useCheckIfAdmin";

export default function LTC() {
    // TODO do shit with this
    const {
        completions, offset, hasNext, onSearch, onPrev, onNext, forceReload, error: searchError, setPendingFilter
    } = useIndexSearch(`/fetch-ltc`);

    const {list: selectedCompletions, toggleElement: toggleSelectedCompletions} = useToggleList();

    const { isAuthenticated, isLoading, user } = useAuth0();
    const getToken = useAccessToken();

    const isAdmin = useCheckIfAdmin();

    
}