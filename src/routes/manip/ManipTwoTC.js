import Select from "react-select";
import selectStyle from "../../util/selectStyle";
import { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { mapToOptions, towerToOptions } from "../../util/selectOptions";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";

function ManipTwoTC({editedTower1 = null, editedTower2 = null, editedMap = null}) {
    const [isOG, setOG] = useState(false);

    const [existingInfo, setExistingInfo] = useState(null);
    const [ogInfo, setOGInfo] = useState(null);

    const theForm = useRef();

    const { getAccessTokenWithPopup } = useAuth0();

    const doEdit = editedTower1 !== null && editedTower2 !== null && editedMap !== null;

    useEffect(() => {
        if (doEdit) {
            fetch('/fetch-2tc?' + new URLSearchParams([
                ['tower1', editedTower1],
                ['tower2', editedTower2],
                ['map', editedMap]
            ])).then(async (res) => {
                let json = await res.json();
                if ('error' in json) {
                    console.log(json.error);
                    setExistingInfo(null);
                } else {
                    setExistingInfo(json.results);
                    let og = json.results?.[0]?.og;
                    setOG(!!og);
                    if (og) {
                        let ogRes = await fetch('/fetch-2tc-og-info?' + new URLSearchParams([
                            ['tower1', editedTower1],
                            ['tower2', editedTower2]
                        ]));
                        let ogJson = await ogRes.json();
                        if ('error' in ogJson) {
                            console.log(ogJson.error);
                            setOGInfo(null);
                        } else {
                            setOGInfo(ogJson.result);
                        }
                    }
                }
            });
        }
    }, [editedTower1, editedTower2, editedMap, doEdit]);

    const submitCallback = useCallback((e) => {
        e.preventDefault();
        const formData = new FormData(theForm.current);
        getAccessTokenWithPopup({
            authorizationParams: {
                audience: 'https://btd6index.win/'
            }
        }).then(async (token) => {
            let result = await fetch(theForm.current.action, {
                method: 'post',
                body: formData,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            result = await result.json();
            if ('error' in result) {
                throw new Error(result.error);
            } else {
                window.alert(result.inserted ? 'Successfully registered 2TC' : '2TC already exists');
            }
        }).catch(error => {
            window.alert(`Error adding 2TC: ${error.message}`);
        });
    }, [getAccessTokenWithPopup]);

    return <>
        <p><a href="/2tc">Back to 2TCs</a></p>
        <h1>{doEdit ? `Edit ${editedTower1} and ${editedTower2} 2TC on ${editedMap}` : "Add a 2TC Completion"}</h1>
        <form method="post" encType="multipart/form-data" action="/member/add-2tc-submit" onSubmit={submitCallback} ref={theForm}>
            <span className="formLine">
                <label htmlFor="tower1">Tower 1</label>
                <Select name="tower1" options={[...towerToOptions.values()]} styles={selectStyle} defaultValue={
                    towerToOptions.get(editedTower1) ?? undefined
                    } required />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="tower2">Tower 2</label>
                <Select name="tower2" options={[...towerToOptions.values()]} styles={selectStyle} defaultValue={
                    towerToOptions.get(editedTower2) ?? undefined
                    } required />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="map">Map</label>
                <Select name="map" options={[...mapToOptions.values()]} styles={selectStyle} defaultValue={
                    mapToOptions.get(editedMap) ?? undefined
                    } required />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="person">Person</label>
                <input name="person" type="text" placeholder="Person" style={{width: '14ch'}} defaultValue={existingInfo?.[0]?.person} required />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="link">Link</label>
                <input name="link" type="text" placeholder="Link" style={{width: '14ch'}} defaultValue={existingInfo?.[0]?.link}  />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="image">Or Upload Image</label>
                <input type="file" name="image" accept="image/jpeg, image/png, image/gif, image/webp, image/apng, video/webm, video/ogg, video/mp4" />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="og">OG Completion?</label>
                <input type="checkbox" name="og" onChange={e => setOG(e.target.checked)} checked={isOG} />
            </span>
            <br />
            {
                isOG && <>
                    <span className="formLine">
                        <label htmlFor="upgrade1">Tower 1 Upgrade</label>
                        <input name="upgrade1" type="text" placeholder="Upgrade 1" style={{width: '14ch'}} defaultValue={ogInfo?.upgrade1} required />
                    </span>
                    <br />
                    <span className="formLine">
                        <label htmlFor="upgrade2">Tower 2 Upgrade</label>
                        <input name="upgrade2" type="text" placeholder="Upgrade 2" style={{width: '14ch'}} defaultValue={ogInfo?.upgrade2} required />
                    </span>
                    <br />
                    <span className="formLine">
                        <label htmlFor="version">Update</label>
                        <input name="version" type="text" placeholder="Update" style={{width: '14ch'}} defaultValue={ogInfo?.version} required />
                    </span>
                    <br />
                    <span className="formLine">
                        <label htmlFor="date">Completion Date</label>
                        <input name="date" type="date" placeholder="Completion Date" style={{width: '14ch'}} defaultValue={ogInfo?.date} required />
                    </span>
                    <br />
                </>
            }
            {editedTower1 && <input type="hidden" name="edited-tower1" value={editedTower1} />}
            {editedTower2 && <input type="hidden" name="edited-tower2" value={editedTower2} />}
            {editedMap && <input type="hidden" name="edited-map" value={editedMap} />}
            <input type="hidden" name="edit" value={doEdit} />
            <input type="submit" name="submit" value={doEdit ? "Update 2TC" : "Add 2TC"} />
        </form>
    </>
};

const AddTwoTC = withAuthenticationRequired(() => {
    return <ManipTwoTC />;
});

const EditTwoTC = withAuthenticationRequired(() => {
    const [params,] = useSearchParams();
    if (['tower1', 'tower2', 'map'].some(key => !params.has(key))) {
        return <h1>Need to specify tower1, tower2, and map</h1>;
    }
    return <ManipTwoTC editedTower1={params.get('tower1')} editedTower2={params.get('tower2')} editedMap={params.get('map')} />
});

export {AddTwoTC, EditTwoTC};
