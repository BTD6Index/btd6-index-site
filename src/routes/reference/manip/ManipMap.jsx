import { withAuthenticationRequired } from "@auth0/auth0-react";
import useCheckIfAdmin from "../../../util/useCheckIfAdmin";
import { useCallback, useRef } from "react";
import useAccessToken from "../../../util/useAccessToken";
import PageTitle from "../../../util/PageTitle";

// TODO add edit ability

function ManipMap({oldMap = null}) {
    const isAdmin = useCheckIfAdmin();
    const getToken = useAccessToken();
    const formRef = useRef();

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
            alert('Successfully added map.');
        } catch (e) {
            alert(`Error adding map: ${e.message}`);
        }
    }, [formRef, getToken]);

    if (!isAdmin) {
        return <PageTitle>You are not authorized to view this page.</PageTitle>;
    }

    return <>
        <PageTitle>{oldMap ? 'Edit Map' : 'Add Map'}</PageTitle>
        <p><a href='/maps'>Back to Maps</a></p>
        <form action="/admin/add-new-map" method="post" ref={formRef} onSubmit={onSubmitCallback}>
            <span className="formLine">
                <label htmlFor="map">Map Name</label>
                <input name='map' id='map' type='text' defaultValue={oldMap} required />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="abbreviation">Map Abbreviation</label>
                <input name='abbreviation' id='abbreviation' type='text' required />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="difficulty">Map Difficulty</label>
                <select id="difficulty" name="difficulty" required>
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
                <input type="text" id="version" name="version" />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="hasLOS">Has gameplay-significant Line of Sight?</label>
                <input type="checkbox" id="hasLOS" name="hasLOS" />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="hasWater">Has water?</label>
                <input type="checkbox" id="hasWater" name="hasWater" />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="length">Average Path Length (in RBS)</label>
                <input type="number" step={0.1} min={0} id="length" name="length" required />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="lengthNotes">Path Length Breakdown (values given in RBS)</label>
                <textarea id="lengthNotes" name="lengthNotes" cols={40} rows={5} />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="numEntrances">Number of Entrances</label>
                <input type="number" min={0} id="numEntrances" name="numEntrances" required />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="numExits">Number of Exits</label>
                <input type="number" min={0} id="numExits" name="numExits" required />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="numObjects">Number of Interactable Objects</label>
                <input type="number" min={0} id="numObjects" name="numObjects" required />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="removalCost">Cost to Remove/Activate All Objects</label>
                <input type="text" id="removalCost" name="removalCost" />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="removalCostNotes">Notes on Object Removal/Activation Costs</label>
                <textarea id="removalCostNotes" name="removalCostNotes" cols={40} rows={5} />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="miscNotes">Miscellaneous Notes</label>
                <textarea id="miscNotes" name="miscNotes" cols={40} rows={5} />
            </span>
            <br />
            <input type="submit" value={oldMap ? 'Update Map' : 'Add Map'} />
        </form>
    </>;
}

export const AddMap = withAuthenticationRequired(() => {
    return <ManipMap />;
});
