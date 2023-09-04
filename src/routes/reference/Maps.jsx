import { useSearchParams } from "react-router-dom";
import { mapToOptions } from "../../util/selectOptions";
import { useEffect, useState } from "react";
import Select from 'react-select';
import selectStyle from "../../util/selectStyle";

export default function Maps() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [mapInfo, setMapInfo] = useState(null);

    useEffect(() => {
        const map = searchParams.get('map');
        if (map) {
            fetch('/fetch-map-info?' + new URLSearchParams({map}))
            .then(async (res) => {
                let resJson = await res.json();
                setMapInfo(resJson);
            });
        }
    }, [searchParams]);

    return <>
        <h1>Maps</h1>
        <p>Select a map in the dropdown below to view information about that map.</p>
        <Select
            options={[...mapToOptions.values()]}
            value={mapToOptions.get(searchParams.get('map')) ?? null}
            onChange={val => setSearchParams({map: val.value})}
            styles={selectStyle}
        />
        {
            mapInfo && <>
                <h2>Map Information for {mapInfo.map}</h2>
                <dl>
                    <dt>Abbreviation</dt>
                    <dd>{mapInfo.abbreviation}</dd>
                    <dt>Map Difficulty</dt>
                    <dd>{mapInfo.difficulty}</dd>
                    <dt>Version Added</dt>
                    <dd>{mapInfo.version}</dd>
                    <dt>Average Path Length (RBS)</dt>
                    <dd>{mapInfo.length}</dd>
                    {
                        mapInfo.lengthNotes && <>
                            <dt>Path Length Breakdown (in RBS)</dt>
                            <dd className="multiline">{mapInfo.lengthNotes}</dd>
                        </>
                    }
                    <dt>Number of Entrances / Exits</dt>
                    <dd>{mapInfo.numEntrances} entrance(s), {mapInfo.numExits} exit(s)</dd>
                    <dt>Has significat Line of Sight obstacles? / Has Water?</dt>
                    <dd>{mapInfo.hasLOS ? 'Yes' : 'No'}, {mapInfo.hasWater ? 'Yes' : 'No'}</dd>
                    <dt>Number of Interactable Objects</dt>
                    <dd>{mapInfo.numObjects}</dd>
                    {
                        mapInfo.removalCost && <>
                            <dt>Cost to Remove/Activate All Objects</dt>
                            <dd>{mapInfo.removalCost}</dd>
                        </>
                    }
                    {
                        mapInfo.removalCostNotes && <>
                            <dt>Object Removal/Activation Notes</dt>
                            <dd className="multiline">{mapInfo.removalCostNotes}</dd>
                        </>
                    }
                    {
                        mapInfo.miscNotes && <>
                            <dt>Miscellaneous Notes</dt>
                            <dd className="multiline">{mapInfo.miscNotes}</dd>
                        </>
                    }
                </dl>
            </>
        }
    </>
}