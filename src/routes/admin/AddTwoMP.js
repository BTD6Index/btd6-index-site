import Select from "react-select";
import towerNames from "../../util/tower-names.json";
import heroNames from "../../util/heroes.json";
import maps from "../../util/maps.json";
import selectStyle from "../../util/selectStyle";
import { useState } from "react";

export default function AddTwoMP() {
    const [isOG, setOG] = useState(false);

    const towerOptions = Object.values(towerNames)
        .flatMap(entries => Object.values(entries)).concat(Object.keys(heroNames))
        .map(entry => ({value: entry, label: entry}));

    const mapOptions = Object.entries(maps)
        .map(entry => ({value: entry[1], label: entry[0]}));

    return <>
        <h1>Add a 2MP Completion</h1>
        <form method="post" encType="multipart/form-data" action="/admin/add-2mp-submit">
            <span className="formLine">
                <label htmlFor="entity">Tower</label>
                <Select name="entity" options={towerOptions} styles={selectStyle} required />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="map">Map</label>
                <Select name="map" options={mapOptions} styles={selectStyle} required />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="person">Person</label>
                <input name="person" type="text" placeholder="Person" style={{width: '14ch'}} required />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="link">Link</label>
                <input name="link" type="text" placeholder="Link" style={{width: '14ch'}} />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="image">Or Upload Image</label>
                <input type="file" name="image" accept="image/jpeg, image/png, image/gif, image/webp, image/apng, video/webm, video/ogg, video/mp4" />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="og">OG Completion?</label>
                <input type="checkbox" name="og" onChange={e => setOG(e.target.checked)} />
            </span>
            <br />
            {
                isOG && <>
                    <span className="formLine">
                        <label htmlFor="upgrade">Upgrade</label>
                        <input name="upgrade" type="text" placeholder="Upgrade" style={{width: '14ch'}} required />
                    </span>
                    <br />
                    <span className="formLine">
                        <label htmlFor="version">Update</label>
                        <input name="version" type="text" placeholder="Update" style={{width: '14ch'}} required />
                    </span>
                    <br />
                    <span className="formLine">
                        <label htmlFor="date">Completion Date</label>
                        <input name="date" type="date" placeholder="Completion Date" style={{width: '14ch'}} required />
                    </span>
                    <br />
                </>
            }
            <input type="submit" name="submit" value="Add 2MP" />
        </form>
    </>
};