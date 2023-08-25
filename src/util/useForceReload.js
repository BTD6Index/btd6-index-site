import { useState, useCallback } from "react";

export default function useForceReload() {
    const [reloadVar, setReloadVar] = useState(false);
    const forceReload = useCallback(() => {
        setReloadVar(state => !state);
    }, []);
    return {reloadVar, setReloadVar, forceReload};
}