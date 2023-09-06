import { useSearchParams } from "react-router-dom";
import MapSelect from "../../util/MapSelect";
import { Fragment, useEffect, useState } from "react";
import useCheckIfAdmin from "../../util/useCheckIfAdmin";
import useAccessToken from "../../util/useAccessToken";
import useForceReload from "../../util/useForceReload";

export default function ChimpsStarts() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [chimpsStartsData, setChimpsStartsData] = useState(null);
    const {reloadVar, forceReload} = useForceReload();
    const [error, setError] = useState(null);
    const getToken = useAccessToken();
    const isAdmin = useCheckIfAdmin();

    useEffect(() => {
        fetch('/fetch-chimps-starts?' + new URLSearchParams({map: searchParams.get('map')}))
        .then(async (res) => {
            const resJson = await res.json();
            if ('error' in resJson) {
                throw new Error(resJson.error);
            }
            setChimpsStartsData(resJson.results);
        })
        .catch(e => {
            setError(e.message);
        });
    }, [searchParams, reloadVar]);

    return <>
        <h1>CHIMPS Starts</h1>
        <p>Select a map in the dropdown below to view useful CHIMPS earlygames.</p>
        {isAdmin && <p><a href="/add-chimps-start">Add CHIMPS Start</a></p>}
        <MapSelect
            mapValue={searchParams.get('map')}
            onChange={val => setSearchParams({map: val.value})}
        />
        { 
            searchParams.get('map') && chimpsStartsData && (
                error ? <h2>Error getting CHIMPS starts for {searchParams.get('map')}: {error}</h2> : <>
                    <h2>Starts for {searchParams.get('map')}</h2>
                    {
                        chimpsStartsData.length
                        ? <dl>
                            {
                            chimpsStartsData.map(chimpsStart => {
                                const onDelete = async () => {
                                    if (confirm(`Delete CHIMPS start "${chimpsStart.title}"?`)) {
                                        try {
                                            const formData = new FormData();
                                            formData.set('uuid', chimpsStart.uuid);
                                            const token = await getToken({
                                                authorizationParams: {
                                                    audience: 'https://btd6index.win/',
                                                    scope: 'openid email profile offline_access'
                                                }
                                            });
                                            const res = await fetch("/admin/delete-chimps-start", {
                                                method: 'post',
                                                body: formData,
                                                headers: {
                                                    Authorization: `Bearer ${token}`
                                                }
                                            });
                                            const resJson = await res.json();
                                            if ('error' in resJson) {
                                                throw new Error(resJson.error);
                                            }
                                            alert(`Successfully deleted "${chimpsStart.title}"`);
                                        } catch (e) {
                                            alert(`Error deleting "${chimpsStart.title}": ${e.message}`);
                                        }
                                        forceReload();
                                    }
                                };

                                return <Fragment key={chimpsStart.uuid}>
                                    <dt>{chimpsStart.title}{isAdmin && <> <button className="dangerButton" onClick={onDelete}>Delete</button></>}</dt>
                                    <dd><a href={chimpsStart.link}>{chimpsStart.link}</a></dd>
                                </Fragment>;
                                })
                            }
                        </dl>
                        : <p>No CHIMPS starts found for {searchParams.get('map')}</p>
                    }
                </>
            )
        }
    </>;
}