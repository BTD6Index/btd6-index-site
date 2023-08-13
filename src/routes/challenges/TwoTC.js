import useIndexSearch from "../../util/useIndexSearch";
import { useCallback, useRef } from "react";
import useToggleList from "../../util/useToggleList";
import { useAuth0 } from "@auth0/auth0-react";

export default function TwoTC() {
    const {query, completions, offset, hasNext, onSearch, onPrev, onNext, forceReload} = useIndexSearch("/fetch-2tc");

    const {list: selectedCompletions, toggleElement: toggleSelectedCompletions} = useToggleList();

    const deleteForm = useRef(null);

    const { getAccessTokenWithPopup } = useAuth0();

    const onDelete = useCallback(async () => {
        if (window.confirm(`Are you sure you want to delete ${selectedCompletions.length} completion(s)?`)) {
            try {
                const token = await getAccessTokenWithPopup({
                    authorizationParams: {
                        audience: 'https://btd6index.win/'
                    }
                });
                let result = await fetch(deleteForm.current.action, {
                    method: 'post',
                    body: new FormData(deleteForm.current),
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                result = await result.json();
                if ('error' in result) {
                    throw new Error(result.error);
                } else {
                    window.alert('Successfully deleted 2TC.');
                    forceReload();
                }
            } catch (error) {
                window.alert(`Error deleting 2TC: ${error.message}`);
            }
        }
    }, [selectedCompletions, deleteForm, getAccessTokenWithPopup, forceReload]);

    return <>
        <h1>Two Towers CHIMPS</h1>
        <p>In this challenge, win a game of CHIMPS with buying exactly two towers (including heroes).</p>
        <p><a href="/admin/add-2tc-form">Add 2TC (Index Helpers)</a></p>
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