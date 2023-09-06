import { useAuth0 } from "@auth0/auth0-react";
import useIndexSearch from "../../util/useIndexSearch";
import useToggleList from "../../util/useToggleList";
import { useRef, useCallback } from "react";
import useCheckIfAdmin from "../../util/useCheckIfAdmin";
import useAccessToken from "../../util/useAccessToken";
import PageTitle from "../../util/PageTitle";

export default function ChallengePage({
    challenge,
    header,
    description,
    fields,
    altFields = ['map'],
    personFields = ['person'],
    auxFields = [],
    fieldHeaders,
    altFieldHeaders = ['Map'],
    personFieldHeaders = ['Player'],
    auxFieldHeaders = [],
    fieldDisplayFunc = null,
    disableOG = false,
    fieldsInvisible = false
}) {
    const defaultFieldDisplayFunc = useCallback(
        ({ fieldName: _dummy, fieldValue, completion: _dummy1 }) => fieldValue || 'N/A',
        []
    );
    fieldDisplayFunc ??= defaultFieldDisplayFunc;

    const {
        completions, offset, hasNext, totalCompletions, onSearch, onPrev, onNext, forceReload, error: searchError, setPendingFilter
    } = useIndexSearch(`/fetch-${challenge}`);

    const { list: selectedCompletions, toggleElement: toggleSelectedCompletions, setList: setSelectedCompletions } = useToggleList();

    const deleteForm = useRef(null);

    const { isAuthenticated, isLoading, user } = useAuth0();
    const getToken = useAccessToken();

    const isAdmin = useCheckIfAdmin();

    const onDelete = useCallback(async () => {
        if (window.confirm(`Are you sure you want to delete ${selectedCompletions.length} completion(s)?`)) {
            try {
                const token = await getToken({
                    authorizationParams: {
                        audience: 'https://btd6index.win/',
                        scope: 'openid email profile offline_access'
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
                    setSelectedCompletions([]);
                    forceReload();
                }
            } catch (error) {
                window.alert(`Error deleting ${challenge}: ${error.message}`);
            }
        }
    }, [selectedCompletions, deleteForm, getToken, forceReload, challenge, setSelectedCompletions]);

    return <>
        <PageTitle>{header}</PageTitle>
        <p>{description}</p>
        <p><a href={`/${challenge}/rules`}><strong>Rules (IMPORTANT)</strong></a></p>
        <p><a href={`/add-${challenge}-form`}>Add {challenge}</a></p>
        <div className="searchUiGroup">
            <input type="text" name="search" id="searchbar" placeholder="Search" onChange={onSearch} />
            <input type="checkbox" id="filter-pending" onChange={e => setPendingFilter(e.target.checked)} />
            <label htmlFor="filter-pending">Pending completions only</label>
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
            {
                !!(!searchError && totalCompletions) && <span>Results {offset+1} to {offset+completions.length} of {totalCompletions}</span>
            }
        </div>
        {searchError ? <p>Error while searching: {searchError}</p> :
            <div className="tableContainer">
                <table>
                    <thead>
                        <tr>
                            {!isLoading && isAuthenticated && <th>Select</th>}
                            {!fieldsInvisible && fieldHeaders.concat(altFieldHeaders).map(fh => <th key={fh}>{fh}</th>)}
                            {personFieldHeaders.map(header => <th key={header}>{header}</th>)}
                            {auxFieldHeaders.map(header => <th key={header}>{header}</th>)}
                            <th>Info</th>
                            {!disableOG && <th>OG?</th>}
                            {!isLoading && isAuthenticated && <th>Edit</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {
                            completions.map(
                                completion => {
                                    const key = JSON.stringify(fields.concat(altFields).map(field => completion[field]));
                                    const hasWritePerms = !isLoading && isAuthenticated && (isAdmin || (user?.sub ?? '') === completion.pending);
                                    const link = completion.link || `https://media.btd6index.win/${completion.filekey}`;

                                    return <tr key={key} className={completion.pending ? 'pendingCompletion' : ''}>
                                        {!isLoading && isAuthenticated && <td>
                                            {hasWritePerms && <input
                                                type="checkbox"
                                                style={{ verticalAlign: "middle" }}
                                                checked={selectedCompletions.includes(key)}
                                                onChange={() => {
                                                    toggleSelectedCompletions(key);
                                                }}
                                            />}
                                        </td>}
                                        {
                                            !fieldsInvisible && fields.concat(altFields)
                                                .map(field => <td key={field}>{fieldDisplayFunc({
                                                    fieldName: field, fieldValue: completion[field], completion
                                                })}</td>)
                                        }
                                        {
                                            personFields.map(field => <td key={field}>{completion[field]}{completion.pending ? ' (Pending)' : ''}</td>)
                                        }
                                        {
                                            auxFields
                                                .map(field => <td key={field}>{fieldDisplayFunc({
                                                    fieldName: field, fieldValue: completion[field], completion
                                                })}</td>)
                                        }
                                        <td><a href={link}>Link</a> | <a href={`/${challenge}/notes?` + new URLSearchParams(
                                            fields.concat(altFields).map(field => [field, completion[field]])
                                        )}>Notes</a></td>
                                        {!disableOG && <td>{completion.og ? <a href={`/${challenge}/extra-info?` + new URLSearchParams(
                                            fields.map(field => [field, completion[field]])
                                        )}>Yes</a> : 'No'}</td>}
                                        {!isLoading && isAuthenticated &&
                                            <td>
                                                {hasWritePerms && <a href={`/edit-${challenge}-form?` + new URLSearchParams(
                                                    fields.concat(altFields).map(field => [field, completion[field]])
                                                )}>Edit{!!completion.pending && " or Verify"}</a>}
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
        <form ref={deleteForm} style={{ display: 'none' }} action={`/member/delete-${challenge}-submit`} method="post">
            <input type="hidden" name="entries" value={
                JSON.stringify(selectedCompletions.map(selected => JSON.parse(selected)))
            } />
        </form>
    </>
};