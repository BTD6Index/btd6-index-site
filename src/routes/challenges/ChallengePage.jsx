import { useAuth0 } from "@auth0/auth0-react";
import useIndexSearch from "../../util/useIndexSearch";
import useToggleList from "../../util/useToggleList";
import { useRef, useCallback, Fragment } from "react";
import useCheckIfAdmin from "../../util/useCheckIfAdmin";
import useAccessToken from "../../util/useAccessToken";
import PageTitle from "../../util/PageTitle";
import { Helmet } from "react-helmet-async";
import useTristateList from "../../util/useTristateList";
import { useSearchParams } from "react-router-dom";

function SortByWidget({sortBy, toggleSortBy, sortByKey}) {
    let sortIcon = "/sort.svg";
    if (sortBy[sortByKey] === true) {
        sortIcon = "/sort-ascending.svg";
    } else if (sortBy[sortByKey] === false) {
        sortIcon = "/sort-descending.svg";
    }
    const onClick = useCallback(() => {
        toggleSortBy(sortByKey);
    }, [toggleSortBy, sortByKey]);
    return <img src={sortIcon} className="sortIcon" alt="Sort" onClick={onClick} />
}

function FieldHeaders({headersList, fieldList, toggleSortBy, sortBy, fieldsToSort = fieldList}) {
    return <>
        {headersList.map((header, idx) => {
            const sortByKey = fieldList[idx];
            return <th key={header}>
                {header}
                {fieldsToSort.includes(sortByKey) && <SortByWidget sortByKey={sortByKey} toggleSortBy={toggleSortBy} sortBy={sortBy} />}
            </th>;
        })}
    </>
}

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
    fieldsInvisible = false,
    alternateFormats = {},
    hasVersion = false
}) {
    const [searchParams, setSearchParams] = useSearchParams();

    const defaultFieldDisplayFunc = useCallback(
        ({ fieldName: _dummy, fieldValue, completion: _dummy1 }) => fieldValue || 'N/A',
        []
    );
    fieldDisplayFunc ??= defaultFieldDisplayFunc;

    const {list: sortBy, toggleElement: toggleSortBy} = useTristateList({});

    const {
        completions,
        offset,
        hasNext,
        totalCompletions,
        onSearch,
        onPrev,
        onNext,
        forceReload,
        error: searchError,
        setPendingFilter,
        setOgFilter,
        onVersionSearch
    } = useIndexSearch(`/fetch-${challenge}`, {sortBy});

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

    const changeAlternateFormat = useCallback(e => {
        setSearchParams({view: e.target.value ?? "List"});
    }, [setSearchParams]);
    const AlternateFormat = alternateFormats[searchParams.get('view')] ?? null;

    return <>
        <PageTitle>{header}</PageTitle>
        <Helmet>
            <meta name="description" content={description} />
        </Helmet>
        <p>{description}</p>
        <p><a href={`/${challenge}/rules`}><strong>Rules (IMPORTANT)</strong></a></p>
        {!isLoading && isAuthenticated && <p><a href={`/add-${challenge}-form`}>Add {challenge}</a></p>}
        {
            Object.keys(alternateFormats).length > 0 && <>
                <input type="radio" id="alternate-format-List" name="format" value="List"
                onChange={changeAlternateFormat} checked={!(searchParams.get('view') in alternateFormats)} />
                <label htmlFor="alternate-format-List">List</label>
                {
                    Object.keys(alternateFormats).map((formatName) => <Fragment key={formatName}>
                        <input type="radio" id={`alternate-format-${formatName}`} name="format" value={formatName}
                        onChange={changeAlternateFormat} checked={searchParams.get('view') === formatName} />
                        <label htmlFor={`alternate-format-${formatName}`}>{formatName}</label>
                    </Fragment>)
                }
            </>
        }
        {
            AlternateFormat === null ? <><div className="searchUiGroup">
                <input type="text" name="search" id="searchbar" placeholder="Search" onChange={onSearch} />
                <input type="checkbox" id="filter-pending" onChange={e => setPendingFilter(e.target.checked)} />
                <label htmlFor="filter-pending">Pending completions only</label>
                { !disableOG && <>
                    <input type="checkbox" id="filter-og" onChange={e => setOgFilter(e.target.checked)} />
                    <label htmlFor="filter-og">OG completions only</label>
                </> }
            </div>
            { hasVersion && <div className="searchUiGroup">
                <input type="text" name="version" id="versionbar" placeholder="Version" onChange={onVersionSearch} />
            </div> }
            <div className="searchUiGroup">
                <button type="button" onClick={onPrev} disabled={offset === 0}>Previous</button>
                <button type="button" onClick={onNext} disabled={!hasNext}>Next</button>
                {
                    !isLoading && isAuthenticated
                    && <>
                        <button type="button" className="dangerButton" disabled={selectedCompletions.length === 0} onClick={onDelete}>
                            Delete Selected
                        </button>
                    </>
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
                                {!fieldsInvisible && <>
                                    <FieldHeaders headersList={fieldHeaders} fieldList={fields} toggleSortBy={toggleSortBy} sortBy={sortBy} />
                                    <FieldHeaders headersList={altFieldHeaders} fieldList={altFields} toggleSortBy={toggleSortBy} sortBy={sortBy} />
                                </>}
                                <FieldHeaders headersList={personFieldHeaders} fieldList={personFields} toggleSortBy={toggleSortBy} sortBy={sortBy} fieldsToSort={[]} />
                                <FieldHeaders
                                    headersList={auxFieldHeaders} fieldList={auxFields} toggleSortBy={toggleSortBy}
                                    sortBy={sortBy} fieldsToSort={['2tc', '2mp'].includes(challenge) ? ['date'] : []} />
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
                                                personFields.map(field => <td key={field}>
                                                    {completion[field]}{completion.pending ? ' (Pending)' : ''}
                                                </td>)
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
            </form></>
            : <AlternateFormat />
        }
    </>
};