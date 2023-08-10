import useIndexSearch from "../../util/useIndexSearch";
import { useCallback, useRef } from "react";
import useToggleList from "../../util/useToggleList";

export default function TwoTC() {
    const {query, completions, onSearch, onPrev, onNext} = useIndexSearch("/fetch-2tc");

    const {list: selectedCompletions, toggleElement: toggleSelectedCompletions} = useToggleList();

    const deleteForm = useRef(null);

    const onDelete = useCallback(() => {
        if (window.confirm(`Are you sure you want to delete ${selectedCompletions.length} completion(s)?`)) {
            deleteForm.current.submit();
        }
    }, [selectedCompletions, deleteForm]);

    return <>
        <h1>Two Towers CHIMPS</h1>
        <p>In this challenge, win a game of CHIMPS with buying exactly two towers (including heroes).</p>
        <p><a href="/admin/add-2tc-form">Add 2TC (Index Helpers)</a></p>
        <input type="text" name="search" id="searchbar" placeholder="Search" value={query} onChange={onSearch} />
        <button type="button" onClick={onPrev}>Previous</button>
        <button type="button" onClick={onNext}>Next</button>
        <button type="button" className="dangerButton" disabled={selectedCompletions.length === 0} onClick={onDelete}>
            Delete Selected
        </button>
        <div className="tableContainer">
        <table>
            <thead>
                <tr>
                    <th>Tower #1</th>
                    <th>Tower #2</th>
                    <th>Map</th>
                    <th>Player</th>
                    <th>Completion Link</th>
                    <th>OG?</th>
                    <th>Select</th>
                    <th>Edit</th>
                </tr>
            </thead>
            <tbody>
                {
                    completions.map(
                        completion => {
                            const rawKey = [completion.tower1, completion.tower2, completion.map];
                            const key = JSON.stringify(rawKey);
                            return <tr key={key}>
                                <td>{completion.tower1}</td>
                                <td>{completion.tower2}</td>
                                <td>{completion.map}</td>
                                <td>{completion.person}</td>
                                <td><a href={completion.link}>Link</a></td>
                                <td>{completion.og ? <a href={"/2tc/extra-info?" + new URLSearchParams([
                                    ['tower1', completion.tower1], ['tower2', completion.tower2]]
                                    )}>Yes</a> : 'No'}</td>
                                <td>
                                    <input
                                        type="checkbox"
                                        style={{verticalAlign: "middle"}}
                                        checked={selectedCompletions.includes(key)}
                                        onChange={() => {
                                            toggleSelectedCompletions(key);
                                        }}
                                    />
                                </td>
                                <td><a href={"/admin/edit-2tc-form?" + new URLSearchParams([
                                    ["tower1", completion.tower1],
                                    ["tower2", completion.tower2],
                                    ["map", completion.map]
                                ])}>Edit</a></td>
                            </tr>;
                        }
                    )
                }
            </tbody>
        </table>
        </div>
        <form ref={deleteForm} style={{display: 'none'}} action="/admin/delete-2tc-submit" method="post">
            <input type="hidden" name="entries" value={
                JSON.stringify(selectedCompletions.map(selected => JSON.parse(selected)))
                } />
        </form>
    </>
};