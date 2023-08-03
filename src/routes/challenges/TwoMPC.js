import useIndexSearch from "../../util/useIndexSearch";

export default function TwoMPC() {
    const {query, completions, onSearch, onPrev, onNext} = useIndexSearch("/fetch-2mp");

    return <>
        <h1>2 Million Pops CHIMPS</h1>
        <p>In this challenge, win CHIMPS with a given tower so that pops on other towers are less than 42,693 (the total pops in a CHIMPS game, excluding regrows, minus 2 million).</p>
        <input type="text" name="search" id="searchbar" placeholder="Search" value={query} onChange={onSearch} />
        <button type="button" onClick={onPrev}>Previous</button>
        <button type="button" onClick={onNext}>Next</button>
        <table>
            <thead>
                <tr>
                    <th>Tower</th>
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
                            <td>{completion.entity}</td>
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