import { useCallback, useEffect, useState } from "react"

export default function useIndexSearch(endpoint) {
    const [query, setQuery] = useState('');
    const [offset, setOffset] = useState(0);
    const [completions, setCompletions] = useState([]);
    const [hasNext, setHasNext] = useState(false);
    const [_reloadVar, _setReloadVar] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(endpoint + "?" + new URLSearchParams({
            query: query,
            offset: offset
        }))
        .then(async response => {
            const data = await response.json();
            if ('error' in data) {
                throw new Error(data.error);
            } else if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            } else if (data !== null) {
                setCompletions(data.results);
                setHasNext(data.more);
            } else {
                setHasNext(false);
            }
        })
        .catch(err => {
            setError(err.message);
        });
    }, [query, offset, endpoint, _reloadVar]);

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

    const forceReload = useCallback(() => {
        _setReloadVar(state => !state);
    }, []);

    return {
        query,
        completions,
        offset,
        hasNext,
        error,
        onSearch,
        onPrev,
        onNext,
        forceReload
    };
};