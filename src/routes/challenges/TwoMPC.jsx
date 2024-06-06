import { useEffect, useState } from "react";
import ChallengePage from "./ChallengePage";
import BitSet from "bitset";

function TwoMPCTable() {
    const [apiResult, setApiResult] = useState(null);

    useEffect(() => {
        fetch('/fetch-2mp-table').then(async (res) => {
            setApiResult(await res.json());
        });
    }, []);

    return apiResult === null ? <></> : <div className="twompTableContainer"><table>
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

export default function TwoMPC() {
    return <ChallengePage
    challenge="2mp"
    header="2 Million Pops CHIMPS"
    description="In this challenge, win CHIMPS with a given tower so that pops on other towers are less than 42,693 (the total pops in a CHIMPS game, excluding regrows, minus 2 million)."
    fieldHeaders={['Entity']}
    fields={['entity']}
    alternateFormats={{Table: () => TwoMPCTable}}
    />
};