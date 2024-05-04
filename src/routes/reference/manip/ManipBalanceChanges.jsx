import { withAuthenticationRequired } from "@auth0/auth0-react";
import PageTitle from "../../../util/PageTitle";
import { useCallback, useState, useRef, useEffect } from "react";
import Select from "react-select";
import selectStyle from "../../../util/selectStyle";
import { towerTypeToOptions } from "../../../util/selectOptions";
import useCheckIfAdmin from "../../../util/useCheckIfAdmin";
import useAccessToken from "../../../util/useAccessToken";
import useForceReload from "../../../util/useForceReload";

const ManipBalanceChanges = withAuthenticationRequired(function () {
    const [tower, setTower] = useState(undefined);
    const [version, setVersion] = useState("");
    const [existingChanges, setExistingChanges] = useState([]);
    const {reloadVar, forceReload} = useForceReload();
    const formRef = useRef();
    const isAdmin = useCheckIfAdmin();
    const getToken = useAccessToken();

    const onAddBalanceChange = useCallback(async (e) => {
        try {
            e.preventDefault();

            const formData = new FormData(formRef.current);
            const token = await getToken({
                authorizationParams: {
                    audience: 'https://btd6index.win/',
                    scope: 'openid email profile offline_access'
                }
            });

            const res = await fetch(formRef.current.action, {
                body: formData,
                method: 'post',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const resJson = await res.json();
            if ('error' in resJson) {
                throw new Error(resJson.error);
            }
            
            alert('Successfully added balance change.');
            forceReload();
        } catch (ex) {
            alert('Error adding balance change: ' + ex.message);
        }
    }, [getToken, forceReload]);

    useEffect(() => {
        if (tower && version) {
            fetch('/fetch-balance-changes?' + new URLSearchParams({tower, version})).then(async (response) => {
                const resJson = await response.json();
                if ('error' in resJson) {
                    throw new Error(resJson.error);
                }
                setExistingChanges(resJson.results);
            });
        }
    }, [tower, version, reloadVar]);

    if (!isAdmin) {
        return <PageTitle>You are not authorized to view this page.</PageTitle>;
    }

    return <>
        <PageTitle>Modify Balance Changes</PageTitle>
        <p><a href="/balance-changes">Back to Balance Changes</a></p>
        <form action="/admin/add-balance-change" onSubmit={onAddBalanceChange} ref={formRef}>
            <Select id="tower" name="tower" options={[...towerTypeToOptions.values()]}
                        styles={selectStyle} placeholder="Tower" isClearable
                        defaultValue={towerTypeToOptions.get(tower) ?? undefined}
                        onChange={val => setTower(val?.value ?? undefined)} />
            <br />
            <input type="text" id="version" name="version" autoComplete="off" placeholder="Version" onChange={val => setVersion(val?.target?.value ?? "")} />
            <h2>Balance Changes</h2>
            <ul>
            {
                existingChanges.map(change => <li key={change.uuid}>{change.change} <button class="dangerButton" type="button" onClick={async () => {
                    if (window.confirm(`Are you sure you want to delete this balance change?`)) {
                        try {
                            const formData = new FormData();
                            formData.set("uuid", change.uuid);
                            const token = await getToken({
                                authorizationParams: {
                                    audience: 'https://btd6index.win/',
                                    scope: 'openid email profile offline_access'
                                }
                            });
                            const res = await fetch('/admin/delete-balance-change', {
                                body: formData,
                                method: 'post',
                                headers: {
                                    Authorization: `Bearer ${token}`
                                }
                            });
                            const resJson = await res.json();
                            if ('error' in resJson) {
                                throw new Error(resJson.error);
                            }

                            alert('Successfully deleted balance change.');
                            forceReload();
                        } catch (ex) {
                            alert('Error deleting balance change: ' + ex.message);
                        }
                    }
                }}>Delete</button></li>)
            }
            </ul>
            <input type="text" id="change" name="change" autoComplete="off" placeholder="New Change" />
            <input type="submit" value="Add Balance Change" />
        </form>
    </>
});

export default ManipBalanceChanges;
