import { useCallback, useEffect, useState } from "react"

export default function useIndexSearch(endpoint) {
    const [query, setQuery] = useState('');
    const [offset, setOffset] = useState(0);
    const [completions, setCompletions] = useState([]);

    useEffect(() => {
        fetch(endpoint + "?" + new URLSearchParams({
            query: query,
            offset: offset
        }))
        .then(async response => {
            if (!response.ok) {
                const json = await response.json();
                console.log(json);
                return null;
            }
            return response.json();
        })
        .then(data => {
            if (data !== null) {
                if (data.length === 0 && offset > 0) {
                    setOffset(Math.max(offset - 10, 0));
                } else {
                    setCompletions(data);
                }
            }
        })
        .catch(err => console.log(err));
    }, [query, offset, endpoint]);

    const onSearch = useCallback((e) => {
        setOffset(0);
        setQuery(e.target.value);
    }, []);

    const onPrev = useCallback(() => {
        setOffset(Math.max(offset - 10, 0));
    }, [offset]);

    const onNext = useCallback(() => {
        setOffset(offset + 10);
    }, [offset]);

    return {
        query,
        completions,
        onSearch,
        onPrev,
        onNext
    };
};