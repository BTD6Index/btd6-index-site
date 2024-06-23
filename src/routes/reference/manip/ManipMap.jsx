import { withAuthenticationRequired } from "@auth0/auth0-react";
import useCheckIfAdmin from "../../../util/useCheckIfAdmin";
import { useCallback, useEffect, useRef } from "react";
import useAccessToken from "../../../util/useAccessToken";
import PageTitle from "../../../util/PageTitle";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

function ManipMap() {
    const isAdmin = useCheckIfAdmin();
    const getToken = useAccessToken();
    const formRef = useRef();
    const [searchParams, setSearchParams] = useSearchParams();
    const [oldMapInfo, setOldMapInfo] = useState(null);

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
            alert(`Successfully ${searchParams.get('map') ? 'edited' : 'added'} map.`);
            if (searchParams.get('map')) {
                setSearchParams({map: formData.get('map')});
            }
        } catch (e) {
            alert(`Error adding map: ${e.message}`);
        }
    }, [formRef, getToken, searchParams, setSearchParams]);

    useEffect(() => {
        if (searchParams.has('map')) {
            setOldMapInfo(null);
            fetch(`/fetch-map-info?${new URLSearchParams({map: searchParams.get('map')})}`).then(async (result) => {
                const resJson = await result.json();
                if ('error' in resJson) {
                    throw new Error(resJson.error);
                }
                setOldMapInfo(resJson);
            });
        }
    }, [searchParams]);

    if (!isAdmin) {
        return <PageTitle>You are not authorized to view this page.</PageTitle>;
    }

    return <>
        <PageTitle>{searchParams.get('map') ? 'Edit Map' : 'Add Map'}</PageTitle>
        <p><a href='/maps'>Back to Maps</a></p>
        {(!searchParams.has('map') || oldMapInfo) && <form action="/admin/add-new-map" method="post" ref={formRef} onSubmit={onSubmitCallback}>
            <span className="formLine">
                <label htmlFor="map">Map Name</label>
                <input name='map' id='map' type='text' defaultValue={searchParams.get('map')} required />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="abbreviation">Map Abbreviation</label>
                <input name='abbreviation' id='abbreviation' type='text' defaultValue={oldMapInfo?.abbreviation} required />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="difficulty">Map Difficulty</label>
                <select id="difficulty" name="difficulty" defaultValue={oldMapInfo?.difficulty} required>
                    <option value="">Select…</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="expert">Expert</option>
                </select>
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="version">Version Added</label>
                <input type="text" id="version" defaultValue={oldMapInfo?.version} name="version" />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="hasLOS">Has gameplay-significant Line of Sight?</label>
                <input type="checkbox" id="hasLOS" defaultChecked={oldMapInfo?.hasLOS} name="hasLOS" />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="hasWater">Has water?</label>
                <input type="checkbox" id="hasWater" defaultChecked={oldMapInfo?.hasWater} name="hasWater" />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="length">Average Path Length (in RBS)</label>
                <input type="number" step={0.1} min={0} id="length" defaultValue={oldMapInfo?.length} name="length" required />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="lengthNotes">Path Length Breakdown (values given in RBS)</label>
                <textarea id="lengthNotes" name="lengthNotes" defaultValue={oldMapInfo?.lengthNotes} cols={40} rows={5} />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="numEntrances">Number of Entrances</label>
                <input type="number" min={0} id="numEntrances" defaultValue={oldMapInfo?.numEntrances} name="numEntrances" required />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="numExits">Number of Exits</label>
                <input type="number" min={0} id="numExits" defaultValue={oldMapInfo?.numExits} name="numExits" required />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="numObjects">Number of Interactable Objects</label>
                <input type="number" min={0} id="numObjects" defaultValue={oldMapInfo?.numObjects} name="numObjects" required />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="removalCost">Cost to Remove/Activate All Objects</label>
                <input type="text" id="removalCost" defaultValue={oldMapInfo?.removalCost} name="removalCost" />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="removalCostNotes">Notes on Object Removal/Activation Costs</label>
                <textarea id="removalCostNotes" name="removalCostNotes" defaultValue={oldMapInfo?.removalCostNotes} cols={40} rows={5} />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="miscNotes">Miscellaneous Notes</label>
                <textarea id="miscNotes" name="miscNotes" defaultValue={oldMapInfo?.miscNotes} cols={40} rows={5} />
            </span>
            <br />
            {searchParams.get('map') && <input type="hidden" name="oldMap" value={searchParams.get('map')} />}
            <input type="submit" value={searchParams.get('map') ? 'Update Map' : 'Add Map'} />
        </form> }
    </>;
}

export const AddMap = withAuthenticationRequired(() => {
    return <ManipMap />;
});
