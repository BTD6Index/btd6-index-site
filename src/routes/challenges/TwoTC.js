import useIndexSearch from "../../util/useIndexSearch";

export default function TwoTC() {
    const {query, completions, onSearch, onPrev, onNext} = useIndexSearch("/fetch-2tc");

    return <>
        <h1>Two Towers CHIMPS</h1>
        <p>In this challenge, win a game of CHIMPS with buying exactly two towers (including heroes).</p>
        <p><a href="/admin/add-2tc-form">Add 2TC (Index Helpers)</a></p>
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