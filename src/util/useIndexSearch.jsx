import { useCallback, useEffect, useState } from "react"
import useForceReload from "./useForceReload";

export default function useIndexSearch(endpoint) {
    const [query, setQuery] = useState('');
    const [offset, setOffset] = useState(0);
    const [totalCompletions, setTotalCompletions] = useState(0);
    const [completions, setCompletions] = useState([]);
    const [hasNext, setHasNext] = useState(false);
    const {reloadVar, forceReload} = useForceReload();
    const [error, setError] = useState(null);
    const [pendingFilter, setPendingFilter] = useState(false);

    useEffect(() => {
        setError(null);
        fetch(endpoint + "?" + new URLSearchParams({
            query: query,
            offset: offset,
            ...(pendingFilter ? {pending: 1} : {})
        }))
        .then(async response => {
            const data = await response.json();
            if ('error' in data) {
                throw new Error(data.error);
            } else if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            } else if (data !== null) {
                setCompletions(data.results);
                setTotalCompletions(data.count);
                setHasNext(data.more);
            } else {
                setHasNext(false);
            }
        })
        .catch(err => {
            setError(err.message);
        });
    }, [query, offset, endpoint, reloadVar, pendingFilter]);

    const onSearch = useCallback((e) => {
        setOffset(0);
        setQuery(e.target.value);
    }, []);

    const onPrev = useCallback(() => {
        setOffset(state => Math.max(state - 10, 0));
    }, []);

    const onNext = useCallback(() => {
        setOffset(state => state + 10);
    }, []);

    return {
        query,
        completions,
        offset,
        hasNext,
        error,
        totalCompletions,
        onSearch,
        onPrev,
        onNext,
        forceReload,
        setPendingFilter
    };
};