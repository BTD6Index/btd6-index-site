import { useCallback, useEffect, useState } from "react"

export default function TwoTC() {
    const [query, setQuery] = useState('');
    const [offset, setOffset] = useState(0);
    const [completions, setCompletions] = useState([]);

    useEffect(() => {
        fetch("/fetch-2tc?" + new URLSearchParams({
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
    }, [query, offset]);

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

    return <>
        <h1>Two Towers CHIMPS</h1>
        <input type="text" name="search" id="searchbar" placeholder="Search" value={query} onChange={onSearch} />
        <button type="button" onClick={onPrev}>Previous</button>
        <button type="button" onClick={onNext}>Next</button>
        <table>
            <thead>
                <tr>
                    <th>Tower #1</th>
                    <th>Tower #2</th>
                    <th>Map</th>
                    <th>Player</th>
                    <th>Completion Link</th>
                    <th>OG?</th>
                </tr>
            </thead>
            <tbody>
                {
                    completions.map(
                        completion => <tr>
                            <td>{completion.tower1}</td>
                            <td>{completion.tower2}</td>
                            <td>{completion.map}</td>
                            <td>{completion.person}</td>
                            <td><a href={completion.link}>Link</a></td>
                            <td>{completion.og ? 'Yes' : 'No'}</td>
                        </tr>
                    )
                }
            </tbody>
        </table>
    </>
};