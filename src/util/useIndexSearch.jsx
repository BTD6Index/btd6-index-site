import { useCallback, useEffect, useState } from "react"
import useForceReload from "./useForceReload";

export default function useIndexSearch(endpoint, {
    count = 20,
    sortBy = {}
}) {
    const [query, setQuery] = useState('');
    const [version, setVersion] = useState('');
    const [offset, setOffset] = useState(0);
    const [totalCompletions, setTotalCompletions] = useState(0);
    const [completions, setCompletions] = useState([]);
    const [hasNext, setHasNext] = useState(false);
    const {reloadVar, forceReload} = useForceReload();
    const [error, setError] = useState(null);
    const [pendingFilter, setPendingFilter] = useState(false);
    const [ogFilter, setOgFilter] = useState(false);

    useEffect(() => {
        setError(null);
        fetch(endpoint + "?" + new URLSearchParams({
            query: query,
            offset: offset,
            count,
            ...(pendingFilter ? {pending: 1} : {}),
            ...(ogFilter ? {og: 1} : {}),
            ...(version ? {version} : {}),
            sortby: Object.entries(sortBy).map(([key, mode]) => {
                switch (mode) {
                case true:
                    return key;
                case false:
                    return `${key} DESC`;
                default:
                    return null;
                }
            }).filter(elem => elem !== null).join(',')
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
    }, [query, offset, endpoint, reloadVar, pendingFilter, ogFilter, count, sortBy, version]);

    const onSearch = useCallback((e) => {
        setOffset(0);
        setQuery(e.target.value);
    }, []);

    const onVersionSearch = useCallback((e) => {
        setOffset(0);
        setVersion(e.target.value);
    }, []);

    const onPrev = useCallback(() => {
        setOffset(state => Math.max(state - count, 0));
    }, [count]);

    const onNext = useCallback(() => {
        setOffset(state => state + count);
    }, [count]);

    return {
        query,
        completions,
        offset,
        hasNext,
        error,
        totalCompletions,
        onSearch,
        onVersionSearch,
        onPrev,
        onNext,
        forceReload,
        setPendingFilter,
        setOgFilter
    };
};