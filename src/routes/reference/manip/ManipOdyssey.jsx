import { withAuthenticationRequired } from "@auth0/auth0-react";
import useCheckIfAdmin from "../../../util/useCheckIfAdmin";
import { useCallback, useRef } from "react";
import useAccessToken from "../../../util/useAccessToken";
import PageTitle from "../../../util/PageTitle";

// TODO add edit ability

function ManipOdyssey({oldOdyssey = null}) {
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
            alert('Successfully added odyssey.');
        } catch (e) {
            alert(`Error adding odyssey: ${e.message}`);
        }
    }, [formRef, getToken]);

    if (!isAdmin) {
        return <PageTitle>You are not authorized to view this page.</PageTitle>;
    }

    return <>
        <PageTitle>{oldOdyssey ? 'Edit Odyssey' : 'Add Odyssey'}</PageTitle>
        <p><a href='/odysseys'>Back to Odysseys</a></p>
        <form action="/admin/add-new-odyssey" method="post" ref={formRef} onSubmit={onSubmitCallback}>
            <span className="formLine">
                <label htmlFor="odysseyNumber">Odyssey Number</label>
                <input name='odysseyNumber' id='odysseyNumber' type='number' defaultValue={oldOdyssey} required />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="odysseyName">Odyssey Name</label>
                <input name='odysseyName' id='odysseyName' type='text' defaultValue={oldOdyssey} required />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="startDate">Start Date</label>
                <input name='startDate' id='startDate' type='date' defaultValue={oldOdyssey} required />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="endDate">End Date</label>
                <input name='endDate' id='endDate' type='date' defaultValue={oldOdyssey} required />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="isExtreme">Is Extreme?</label>
                <input type="checkbox" id="isExtreme" name="isExtreme" />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="islandOne">Island One Info</label>
                <input name='islandOne' id='islandOne' type='text' defaultValue={oldOdyssey} required />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="islandTwo">Island Two Info</label>
                <input name='islandTwo' id='islandTwo' type='text' defaultValue={oldOdyssey} required />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="islandThree">Island Three Info</label>
                <input name='islandThree' id='islandThree' type='text' defaultValue={oldOdyssey} required />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="islandFour">Island Four Info</label>
                <input name='islandFour' id='islandFour' type='text' defaultValue={oldOdyssey} required />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="islandFive">Island Five Info</label>
                <input name='islandFive' id='islandFive' type='text' defaultValue={oldOdyssey} required />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="heroes">Hero Info</label>
                <input name='heroes' id='heroes' type='text' defaultValue={oldOdyssey} required />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="primaryTowers">Primary Tower Info</label>
                <input name='primaryTowers' id='primaryTowers' type='text' defaultValue={oldOdyssey} required />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="militaryTowers">Military Tower Info</label>
                <input name='militaryTowers' id='militaryTowers' type='text' defaultValue={oldOdyssey} required />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="magicTowers">Magic Tower Info</label>
                <input name='magicTowers' id='magicTowers' type='text' defaultValue={oldOdyssey} required />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="supportTowers">Support Tower Info</label>
                <input name='supportTowers' id='supportTowers' type='text' defaultValue={oldOdyssey} required />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="miscNotes">Miscellaneous Notes</label>
                <textarea id="miscNotes" name="miscNotes" cols={40} rows={5} />
            </span>
            <br />
            <input type="submit" value={oldOdyssey ? 'Update Odyssey' : 'Add Odyssey'} />
        </form>
    </>;
}

export const AddOdyssey = withAuthenticationRequired(() => {
    return <ManipOdyssey />;
});
