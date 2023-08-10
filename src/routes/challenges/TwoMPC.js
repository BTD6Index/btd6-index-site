import useIndexSearch from "../../util/useIndexSearch";
import useToggleList from "../../util/useToggleList";
import { useRef, useCallback } from "react";

export default function TwoMPC() {
    const {query, completions, offset, hasNext, onSearch, onPrev, onNext} = useIndexSearch("/fetch-2mp");

    const {list: selectedCompletions, toggleElement: toggleSelectedCompletions} = useToggleList();

    const deleteForm = useRef(null);

    const onDelete = useCallback(() => {
        if (window.confirm(`Are you sure you want to delete ${selectedCompletions.length} completion(s)?`)) {
            deleteForm.current.submit();
        }
    }, [selectedCompletions, deleteForm]);

    return <>
        <h1>2 Million Pops CHIMPS</h1>
        <p>In this challenge, win CHIMPS with a given tower so that pops on other towers are less than 42,693 (the total pops in a CHIMPS game, excluding regrows, minus 2 million).</p>
        <p><a href="/admin/add-2mp-form">Add 2MP (Index Helpers)</a></p>
        <input type="text" name="search" id="searchbar" placeholder="Search" value={query} onChange={onSearch} />
        <button type="button" onClick={onPrev} disabled={offset === 0}>Previous</button>
        <button type="button" onClick={onNext} disabled={!hasNext}>Next</button>
        <button type="button" className="dangerButton" disabled={selectedCompletions.length === 0} onClick={onDelete}>
            Delete Selected
        </button>
        <div className="tableContainer">
        <table>
            <thead>
                <tr>
                    <th>Tower</th>
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
                            const key = JSON.stringify([completion.entity, completion.map]);
                            return <tr key={key}>
                                <td>{completion.entity}</td>
                                <td>{completion.map}</td>
                                <td>{completion.person}</td>
                                <td><a href={completion.link}>Link</a></td>
                                <td>{completion.og ? <a href={'/2mp/extra-info?' + new URLSearchParams([
                                    ['entity', completion.entity]
                                    ])}>Yes</a> : 'No'}</td>
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
                                <td><a href={"/admin/edit-2mp-form?" + new URLSearchParams([
                                    ["entity", completion.entity], ["map", completion.map]
                                ])}>Edit</a></td>
                            </tr>;
                        }
                    )
                }
            </tbody>
        </table>
        </div>
        <form ref={deleteForm} style={{display: 'none'}} action="/admin/delete-2mp-submit" method="post">
            <input type="hidden" name="entries" value={
                JSON.stringify(selectedCompletions.map(selected => JSON.parse(selected)))
                } />
        </form>
    </>
};