import { useAuth0 } from "@auth0/auth0-react";
import useIndexSearch from "../../util/useIndexSearch";
import useToggleList from "../../util/useToggleList";
import { useRef, useCallback, useEffect, useState } from "react";

export default function ChallengePage({ challenge, header, description, fields, fieldHeaders }) {
    const {query, completions, offset, hasNext, onSearch, onPrev, onNext, forceReload} = useIndexSearch(`/fetch-${challenge}`);

    const {list: selectedCompletions, toggleElement: toggleSelectedCompletions} = useToggleList();

    const deleteForm = useRef(null);

    const verifyForm = useRef(null);

    const { getAccessTokenWithPopup, isAuthenticated, isLoading, getIdTokenClaims, user } = useAuth0();

    const [isAdmin, setAdmin] = useState(false);

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            getIdTokenClaims().then((claims) => {
                setAdmin(claims?.['https://btd6index.win/roles']?.includes('Index Helper') ?? false);
            });
        }
    }, [getIdTokenClaims, isLoading, isAuthenticated]);

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
                    window.alert(`Successfully deleted ${challenge}.`);
                    forceReload();
                }
            } catch (error) {
                window.alert(`Error deleting ${challenge}: ${error.message}`);
            }
        }
    }, [selectedCompletions, deleteForm, getAccessTokenWithPopup, forceReload, challenge]);

    return <>
        <h1>{header}</h1>
        <p>{description}</p>
        { !isLoading && isAuthenticated && <p><a href={`/add-${challenge}-form`}>Add {challenge}</a></p> }
        <input type="text" name="search" id="searchbar" placeholder="Search" value={query} onChange={onSearch} />
        <button type="button" onClick={onPrev} disabled={offset === 0}>Previous</button>
        <button type="button" onClick={onNext} disabled={!hasNext}>Next</button>
        {
            !isLoading && isAuthenticated
            && <button type="button" className="dangerButton" disabled={selectedCompletions.length === 0} onClick={onDelete}>
                Delete Selected
            </button>
        }
        <div className="tableContainer">
        <table>
            <thead>
                <tr>
                    {fieldHeaders.map(fh => <th key={fh}>{fh}</th>)}
                    <th>Map</th>
                    <th>Player</th>
                    <th>Completion Link</th>
                    <th>OG?</th>
                    { !isLoading && isAuthenticated && <th>Select</th> }
                    { !isLoading && isAuthenticated && <th>Edit</th> }
                </tr>
            </thead>
            <tbody>
                {
                    completions.map(
                        completion => {
                            const key = JSON.stringify([...fields.map(field => completion[field]), completion.map]);
                            const hasWritePerms = !isLoading && isAuthenticated && (isAdmin || (user?.sub ?? '') === completion.pending);
                            return <tr key={key} className={completion.pending ? 'pendingCompletion' : ''}>
                                { fields.map(field => <td key={field}>{completion[field]}</td>) }
                                <td>{completion.map}</td>
                                <td>{completion.person}{completion.pending ? ' (Pending)' : ''}</td>
                                <td><a href={completion.link}>Link</a></td>
                                <td>{completion.og ? <a href={`/${challenge}/extra-info?` + new URLSearchParams(
                                    fields.map(field => [field, completion[field]])
                                )}>Yes</a> : 'No'}</td>
                                { hasWritePerms && <td>
                                    <input
                                        type="checkbox"
                                        style={{verticalAlign: "middle"}}
                                        checked={selectedCompletions.includes(key)}
                                        onChange={() => {
                                            toggleSelectedCompletions(key);
                                        }}
                                    />
                                </td> }
                                {
                                hasWritePerms &&
                                <td><a href={`/edit-${challenge}-form?` + new URLSearchParams([
                                    ...fields.map(field => [field, completion[field]]), ["map", completion.map]
                                ])}>Edit</a></td>
                                }
                            </tr>;
                        }
                    )
                }
            </tbody>
        </table>
        </div>
        <form ref={deleteForm} style={{display: 'none'}} action={`/member/delete-${challenge}-submit`} method="post">
            <input type="hidden" name="entries" value={
                JSON.stringify(selectedCompletions.map(selected => JSON.parse(selected)))
                } />
        </form>
        <form ref={verifyForm} style={{display: 'none'}} action={`/admin/verify-${challenge}-submit`} method="post">
            <input type="hidden" name="entries" value={
                    JSON.stringify(selectedCompletions.map(selected => JSON.parse(selected)))
                    } />
        </form>
    </>
};