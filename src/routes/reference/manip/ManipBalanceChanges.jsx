import { withAuthenticationRequired } from "@auth0/auth0-react";
import PageTitle from "../../../util/PageTitle";
import { useCallback, useState, useRef } from "react";
import Select from "react-select";
import selectStyle from "../../../util/selectStyle";
import { towerTypeToOptions } from "../../../util/selectOptions";
import useCheckIfAdmin from "../../../util/useCheckIfAdmin";
import useAccessToken from "../../../util/useAccessToken";

const ManipBalanceChanges = withAuthenticationRequired(function () {
    const [tower, setTower] = useState(undefined);
    const [version, setVersion] = useState("");
    const formRef = useRef();
    const isAdmin = useCheckIfAdmin();
    const getToken = useAccessToken();

    const onAddBalanceChange = useCallback(async (e) => {
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
    }, [getToken]);

    if (!isAdmin) {
        return <PageTitle>You are not authorized to view this page.</PageTitle>;
    }

    return <>
        <PageTitle>Modify Balance Changes</PageTitle>
        <form action="/admin/add-balance-change" onSubmit={onAddBalanceChange} ref={formRef}>
            <Select id="tower" name="tower" options={[...towerTypeToOptions.values()]}
                        styles={selectStyle} placeholder="Tower" isClearable
                        defaultValue={towerTypeToOptions.get(tower) ?? undefined}
                        onChange={val => setTower(val?.value ?? undefined)} />
            <br />
            <input type="text" id="version" name="version" autoComplete="off" placeholder="Version" onChange={val => setVersion(val?.target?.value ?? "")} />
            <h2>Balance Changes</h2>
            <input type="text" id="change" name="change" autoComplete="off" placeholder="New Change" />
            <input type="submit" value="Add Balance Change" />
        </form>
    </>
});

export default ManipBalanceChanges;
