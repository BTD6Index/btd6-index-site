import { withAuthenticationRequired } from "@auth0/auth0-react";
import useCheckIfAdmin from "../../../util/useCheckIfAdmin";
import { useCallback, useEffect, useRef } from "react";
import useAccessToken from "../../../util/useAccessToken";
import PageTitle from "../../../util/PageTitle";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

function ManipOdyssey() {
    const isAdmin = useCheckIfAdmin();
    const getToken = useAccessToken();
    const formRef = useRef();
    const [searchParams, setSearchParams] = useSearchParams();
    const [oldOdysseyInfo, setOldOdysseyInfo] = useState(null);

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
            alert(`Successfully ${searchParams.get('odysseyName') ? 'edited' : 'added'} Odyssey.`);
            if (searchParams.get('odysseyName')) {
                setSearchParams({odysseyName: formData.get('odysseyName')});
            }
        } catch (e) {
            alert(`Error adding Odyssey: ${e.message}`);
        }
    }, [formRef, getToken, searchParams, setSearchParams]);

    useEffect(() => {
        if (searchParams.has('odysseyName')) {
            setOldOdysseyInfo(null);
            fetch(`/fetch-odyssey-info?${new URLSearchParams({odysseyName: searchParams.get('odysseyName')})}`).then(async (result) => {
                const resJson = await result.json();
                if ('error' in resJson) {
                    throw new Error(resJson.error);
                }
                setOldOdysseyInfo(resJson);
            });
        }
    }, [searchParams]);

    if (!isAdmin) {
        return <PageTitle>You are not authorized to view this page.</PageTitle>;
    }

    return <>
        <PageTitle>{searchParams.get('odysseyName') ? 'Edit Odyssey' : 'Add Odyssey'}</PageTitle>
        <p><a href='/odysseys'>Back to Odysseys</a></p>
        {(!searchParams.has('odysseyName') || oldOdysseyInfo) && <form action="/admin/add-new-odyssey" method="post" ref={formRef} onSubmit={onSubmitCallback}>
            <br />
            <span className="formLine">
                <label htmlFor="odysseyName">Odyssey Name</label>
                <input name='odysseyName' id='odysseyName' type='text' size="50" defaultValue={oldOdysseyInfo?.odysseyName} required />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="startDate">Start Date</label>
                <input name='startDate' id='startDate' type='date' defaultValue={oldOdysseyInfo?.startDate} required />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="endDate">End Date</label>
                <input name='endDate' id='endDate' type='date' defaultValue={oldOdysseyInfo?.endDate} required />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="isExtreme">Is Extreme?</label>
                <input type="checkbox" id="isExtreme" name="isExtreme" defaultChecked={oldOdysseyInfo?.isExtreme}/>
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="islandOne">Island One Info</label>
                <input name='islandOne' id='islandOne' type='text' size="50" defaultValue={oldOdysseyInfo?.islandOne} required />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="islandTwo">Island Two Info</label>
                <input name='islandTwo' id='islandTwo' type='text' size="50" defaultValue={oldOdysseyInfo?.islandTwo} required />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="islandThree">Island Three Info</label>
                <input name='islandThree' id='islandThree' type='text' size="50" defaultValue={oldOdysseyInfo?.islandThree} required />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="islandFour">Island Four Info</label>
                <input name='islandFour' id='islandFour' type='text' size="50" defaultValue={oldOdysseyInfo?.islandFour} required />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="islandFive">Island Five Info</label>
                <input name='islandFive' id='islandFive' type='text' size="50" defaultValue={oldOdysseyInfo?.islandFive} required />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="seats">Number of Seats</label>
                <input name='seats' id='seats' type='number' defaultValue={oldOdysseyInfo?.seats} required />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="towers">Number of Towers</label>
                <input name='towers' id='towers' type='number' defaultValue={oldOdysseyInfo?.towers} required />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="heroes">Hero Info</label>
                <input name='heroes' id='heroes' type='text' size="80" defaultValue={oldOdysseyInfo?.heroes} required />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="primaryTowers">Primary Tower Info</label>
                <input name='primaryTowers' id='primaryTowers' type='text' size="40" defaultValue={oldOdysseyInfo?.primaryTowers} required />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="militaryTowers">Military Tower Info</label>
                <input name='militaryTowers' id='militaryTowers' type='text' size="40" defaultValue={oldOdysseyInfo?.militaryTowers} required />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="magicTowers">Magic Tower Info</label>
                <input name='magicTowers' id='magicTowers' type='text' size="40" defaultValue={oldOdysseyInfo?.magicTowers} required />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="supportTowers">Support Tower Info</label>
                <input name='supportTowers' id='supportTowers' type='text' size="40" defaultValue={oldOdysseyInfo?.supportTowers} required />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="miscNotes">Miscellaneous Notes</label>
                <textarea id="miscNotes" name="miscNotes" cols={50} rows={5} defaultValue={oldOdysseyInfo?.miscNotes}/>
            </span>
            <br />
            {searchParams.get('odysseyName') && <input type="hidden" name="oldOdyssey" value={searchParams.get('odysseyName')} />}
            <input type="submit" value={oldOdysseyInfo ? 'Update Odyssey' : 'Add Odyssey'} />
        </form>
        }
    </>;
}

export const AddOdyssey = withAuthenticationRequired(() => {
    return <ManipOdyssey />;
});
