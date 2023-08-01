import { useEffect, useState } from "react"

export default function TwoTC() {
    const [query, setQuery] = useState('');
    const [offset, setOffset] = useState(0);
    const [completions, setCompletions] = useState([]);

    useEffect(() => {
        fetch("/fetch-2tc?" + new URLSearchParams({
            query: query,
            offset: offset
        }))
        .then(response => response.json())
        .then(data => {
            setCompletions(data);
        })
        .catch(err => console.log(err));
    }, [query, offset]);

    const onSearch = (e) => {
        setOffset(0);
        setQuery(e.target.value);
    };

    const onPrev = () => {
        setOffset(offset - 10);
    }

    const onNext = () => {
        setOffset(offset + 10);
    };

    return <>
        <h1>Two Towers CHIMPS</h1>
        <input type="text" name="search" id="searchbar" placeholder="Search" value={query} onChange={onSearch} />
        <table>
            <thead>
                <tr>
                    <th>Tower #1</th>
                    <th>Tower #2</th>
                    <th>Player</th>
                    <th>Completion Link</th>
                </tr>
            </thead>
            <tbody>
                {
                    completions.map(
                        completion => <tr>
                            <td>{completion.tower1}</td>
                            <td>{completion.tower2}</td>
                            <td>{completion.person}</td>
                            <td><a href={completion.link}>Link</a></td>
                        </tr>
                    )
                }
            </tbody>
        </table>
        <button type="button" onClick={onPrev}>Previous</button>
        <button type="button" onClick={onNext}>Next</button>
    </>
};