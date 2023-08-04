import Select from "react-select";
import towerNames from "../../util/tower-names.json";
import heroNames from "../../util/heroes.json";

export default function AddTwoTC() {
    const selectStyle = {
        control: styles => ({...styles, color: 'black'}),
        container: styles => ({...styles, display: 'inline-block', width: '15ch', textAlign: 'left'}),
        option: (styles, { data, isDisabled, isFocused, isSelected }) => ({...styles, color: 'black'})
    };

    const towerOptions = Object.values(towerNames)
        .flatMap(entries => Object.values(entries)).concat(Object.keys(heroNames))
        .map(entry => ({value: entry, label: entry}))

    return <>
        <h1>Add a 2TC Completion</h1>
        <label for="tower1">Tower 1</label>
        <Select name="tower1" options={towerOptions} styles={selectStyle} />
        <br />
        <label for="tower2">Tower 2</label>
        <Select name="tower2" options={towerOptions} styles={selectStyle} />
        <br />
        <label for="person">Person</label>
        <input name="person" type="text" placeholder="Person" />
    </>
};