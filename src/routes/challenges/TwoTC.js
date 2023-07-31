import { useEffect, useState } from "react"

export default function TwoTC() {
    const [query, setQuery] = useState('');
    const [completions, setCompletions] = useState([]);

    useEffect(() => {
        fetch("/fetch-2tc?" + new URLSearchParams({
            query: query
        }))
        .then(response => response.json())
        .then(data => {
            setCompletions(data);
        })
        .catch(err => console.log(err));
    }, [query]);

    return <>
        <h1>Two Towers CHIMPS</h1>
        <input type="text" name="search" id="searchbar" placeholder="Search" value={query} onChange={e => setQuery(e.target.value)} />
        <input type="submit" name="submit" value="Search" />
        <table>
            <tr>
                <th>Tower #1</th>
                <th>Tower #2</th>
                <th>Player</th>
                <th>Completion Link</th>
            </tr>
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
        </table>
    </>
};