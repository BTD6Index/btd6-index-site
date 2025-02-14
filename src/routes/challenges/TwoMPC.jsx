import { useEffect, useState, useRef } from "react";
import ChallengePage from "./ChallengePage";
import BitSet from "bitset";
import { defaultRules, editRule } from "../../util/rules";

function TwoMPCTable() {
    const [apiResult, setApiResult] = useState(null);

    useEffect(() => {
        fetch('/fetch-2mp-table').then(async (res) => {
            setApiResult(await res.json());
        });
    }, []);

    return apiResult === null ? <></> : <div className="twompTableContainer"><table className="twowayTable">
        <thead>
            <tr>
                <td></td>
                {apiResult.mapList.map(mapData => <th scope="col" key={mapData.map}>{mapData.map}</th>)}
            </tr>
        </thead>
        <tbody>
            {Object.keys(apiResult.tableData).sort().map((entity) => {
                const bitset = BitSet.fromHexString(apiResult.tableData[entity]);
                return <tr key={entity}>
                    <th scope="row">{entity}</th>
                    {apiResult.mapList.map((mapData, idx) => <td key={mapData.map}>{bitset.get(idx) ? '✅' : ''}</td>)}
                </tr>;
            })}
        </tbody>
    </table></div>;
}

function TwoMPPersonStats() {
    const [apiResult, setApiResult] = useState(null);

    useEffect(() => {
        fetch('/fetch-2mp-person-counts?limit=10').then(async (res) => {
            setApiResult(await res.json());
        });
    }, []);

    return apiResult === null ? <></> : <>
        <h2>Top 10 Leaderboard</h2>
        <div className="tableContainer">
            <table>
                <thead>
                    <tr>
                        <th>Person</th>
                        <th># of Completions</th>
                        <th># of Maps Completed</th>
                        <th>Most Completed Map</th>
                        <th>Most Completed Difficulty</th>
                    </tr>
                </thead>
                <tbody>
                    {apiResult.personData.map(data => <tr key={data.person}>
                        <td>{data.person}</td>
                        <td>{data.count}</td>
                        <td>{data.uniquecount}</td>
                        <td>{data.favoritemap}</td>
                        <td>{data.favoritedifficulty}</td>
                    </tr>)}
                </tbody>
            </table>
        </div>
    </>;
}

export default function TwoMPC() {
    const effectRan = useRef(false);
    const [allRules, setAllRules] = useState(defaultRules);
    
    useEffect(() => {
        if(effectRan.current === true){
            setAllRules(a => [...editRule(a, 'Submission Requirements', {
                name: 'Submission Requirements',
                rule: <div>
                        <h2>Submission Requirements</h2>
                        <p>Victory screen screenshots alone are insufficient for inclusion in The Index. You must also provide a screenshot of the final tower setup with the 2MP'ed tower selected.</p> 
                        <p>The exception is if something like the Covered Garden roof prevents clicking on the tower, in which case a victory screen is acceptable.</p>
                    </div>,
            })])
        }
        return () => {effectRan.current = true}
    }, [])

    return <ChallengePage
    challenge="2mp"
    header="2 Million Pops CHIMPS"
    description="In this challenge, win CHIMPS with a given tower so that pops on other towers are less than 42,693 (the total pops in a CHIMPS game, excluding regrows, minus 2 million)."
    fieldHeaders={['Entity']}
    fields={['entity']}
    alternateFormats={{Table: TwoMPCTable, 'Person Stats': TwoMPPersonStats}}
    auxFields={['version', 'date']}
    auxFieldHeaders={['OG Version', 'OG Date']}
    fieldDisplayFunc={({ fieldName, fieldValue, completion }) => {
        if ((fieldName === 'version' || fieldName === 'date') && !completion.og) {
            return 'N/A';
        }
        return fieldValue || 'N/A';
    }}
    rules={allRules}
    />
};