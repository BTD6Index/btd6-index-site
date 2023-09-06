import { withAuthenticationRequired } from "@auth0/auth0-react"
import useCheckIfAdmin from "../../../util/useCheckIfAdmin";
import useAccessToken from "../../../util/useAccessToken";
import { useRef, useCallback, useState } from "react";
import MapSelect from "../../../util/MapSelect";
import PageTitle from "../../../util/PageTitle";

const AddChimpsStart = withAuthenticationRequired(() => {
    const isAdmin = useCheckIfAdmin();
    const getToken = useAccessToken();
    const formRef = useRef();
    const [map, setMap] = useState();

    const onSubmitCallback = useCallback(async (event) => {
        try {
            event.preventDefault();
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
            alert('Successfully added CHIMPS start.');
        } catch (e) {
            alert(`Error adding CHIMPS start: ${e.message}`);
        }
    }, [formRef, getToken]);

    if (!isAdmin) {
        return <PageTitle>You are not authorized to view this page.</PageTitle>;
    }

    return <>
        <PageTitle>Add CHIMPS Start</PageTitle>
        <p><a href="/chimps-starts">Back to CHIMPS Starts</a></p>
        <form action="/admin/add-new-chimps-start" method="post" ref={formRef} onSubmit={onSubmitCallback}>
            <span className="formLine">
                <label htmlFor="map">Map</label>
                <MapSelect name="map" inputId="map" mapValue={map} onChange={val => setMap(val.value)} required />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="title">CHIMPS Start Name</label>
                <input type="text" id="title" name="title" placeholder="Name" />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="link">Link</label>
                <input type="text" id="link" name="link" placeholder="Link" />
            </span>
            <br />
            <input type="submit" value="Add CHIMPS Start" />
        </form>
    </>;
});

export default AddChimpsStart;
