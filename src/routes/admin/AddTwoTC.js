import Select from "react-select";
import towerNames from "../../util/tower-names.json";
import heroNames from "../../util/heroes.json";
import maps from "../../util/maps.json";
import selectStyle from "../../util/selectStyle";

export default function AddTwoTC() {
    const towerOptions = Object.values(towerNames)
        .flatMap(entries => Object.values(entries)).concat(Object.keys(heroNames))
        .map(entry => ({value: entry, label: entry}));

    const mapOptions = Object.entries(maps)
        .map(entry => ({value: entry[1], label: entry[0]}));

    return <>
        <h1>Add a 2TC Completion</h1>
        <form method="post" encType="multipart/form-data" action="/admin/add-2tc-submit">
            <span className="formLine">
                <label htmlFor="tower1">Tower 1</label>
                <Select name="tower1" options={towerOptions} styles={selectStyle} required />
            </span>
            <br />
            <span className="formLine">
                <label htmlFor="tower2">Tower 2</label>
                <Select name="tower2" options={towerOptions} styles={selectStyle} required />
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
                <input type="checkbox" name="og" />
            </span>
            <br />
            <input type="submit" name="submit" value="Add 2TC" />
        </form>
    </>
};