import { useAuth0 } from "@auth0/auth0-react";
import useIndexSearch from "../../util/useIndexSearch";
import useToggleList from "../../util/useToggleList";
import { useRef, useCallback } from "react";
import useCheckIfAdmin from "../../util/useCheckIfAdmin";
import { imageObjectRegex } from "../../util/imageObjectRegex";
import useAccessToken from "../../util/useAccessToken";

export default function ChallengePage({ challenge, header, description, fields, personFields = ['player'], fieldHeaders, personFieldHeaders = ['Player'] }) {
    const {
        completions, offset, hasNext, onSearch, onPrev, onNext, forceReload, error: searchError, setPendingFilter
    } = useIndexSearch(`/fetch-${challenge}`);

    const {list: selectedCompletions, toggleElement: toggleSelectedCompletions} = useToggleList();

    const deleteForm = useRef(null);

    const { isAuthenticated, isLoading, user } = useAuth0();
    const getToken = useAccessToken();

    const isAdmin = useCheckIfAdmin();

    const onDelete = useCallback(async () => {
        if (window.confirm(`Are you sure you want to delete ${selectedCompletions.length} completion(s)?`)) {
            try {
                const token = await getToken({
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
    }, [selectedCompletions, deleteForm, getToken, forceReload, challenge]);

    return <>
        <h1>{header}</h1>
        <p>{description}</p>
        <p><a href={`/${challenge}/rules`}><strong>Rules (IMPORTANT)</strong></a></p>
        { !isLoading && isAuthenticated && <p><a href={`/add-${challenge}-form`}>Add {challenge}</a></p> }
        <div className="searchUiGroup">
            <input type="text" name="search" id="searchbar" placeholder="Search" onChange={onSearch} />
            <input type="checkbox" name="pending" onChange={e => setPendingFilter(e.target.checked)} />
            <label htmlFor="pending">Pending completions only</label>
        </div>
        <div className="searchUiGroup">
            <button type="button" onClick={onPrev} disabled={offset === 0}>Previous</button>
            <button type="button" onClick={onNext} disabled={!hasNext}>Next</button>
            {
                !isLoading && isAuthenticated
                && <button type="button" className="dangerButton" disabled={selectedCompletions.length === 0} onClick={onDelete}>
                    Delete Selected
                </button>
            }
        </div>
        { searchError ? <p>Error while searching: {searchError}</p> :
        <div className="tableContainer">
            <table>
                <thead>
                    <tr>
                        { !isLoading && isAuthenticated && <th>Select</th> }
                        {fieldHeaders.map(fh => <th key={fh}>{fh}</th>)}
                        <th>Map</th>
                        { personFieldHeaders.map(header => <th key={header}>{header}</th>) }
                        <th>Info</th>
                        <th>OG?</th>
                        { !isLoading && isAuthenticated && <th>Edit</th> }
                    </tr>
                </thead>
                <tbody>
                    {
                        completions.map(
                            completion => {
                                const key = JSON.stringify([...fields.map(field => completion[field]), completion.map]);
                                const hasWritePerms = !isLoading && isAuthenticated && (isAdmin || (user?.sub ?? '') === completion.pending);
                                const link = !completion.link || imageObjectRegex.exec(completion.link) ? `https://media.btd6index.win/${completion.filekey}` : completion.link
                                
                                return <tr key={key} className={completion.pending ? 'pendingCompletion' : ''}>
                                    { !isLoading && isAuthenticated && <td>
                                        {hasWritePerms && <input
                                            type="checkbox"
                                            style={{verticalAlign: "middle"}}
                                            checked={selectedCompletions.includes(key)}
                                            onChange={() => {
                                                toggleSelectedCompletions(key);
                                            }}
                                        /> }
                                    </td> }
                                    { fields.map(field => <td key={field}>{completion[field]}</td>) }
                                    <td>{completion.map}</td>
                                    {
                                        personFields.map(field => <td key={field}>{completion[field]}{completion.pending ? ' (Pending)' : ''}</td>)
                                    }
                                    <td><a href={link}>Link</a> | <a href={`/${challenge}/notes?` + new URLSearchParams(
                                        fields.concat('map').map(field => [field, completion[field]])
                                    )}>Notes</a></td>
                                    <td>{completion.og ? <a href={`/${challenge}/extra-info?` + new URLSearchParams(
                                        fields.map(field => [field, completion[field]])
                                    )}>Yes</a> : 'No'}</td>
                                    { !isLoading && isAuthenticated &&
                                    <td>
                                        {hasWritePerms && <a href={`/edit-${challenge}-form?` + new URLSearchParams([
                                            ...fields.map(field => [field, completion[field]]), ["map", completion.map]
                                        ])}>Edit{!!completion.pending && " or Verify"}</a>}
                                    </td>
                                    }
                                </tr>;
                            }
                        )
                    }
                </tbody>
            </table>
        </div>
        }
        <form ref={deleteForm} style={{display: 'none'}} action={`/member/delete-${challenge}-submit`} method="post">
            <input type="hidden" name="entries" value={
                JSON.stringify(selectedCompletions.map(selected => JSON.parse(selected)))
                } />
        </form>
    </>
};