import { useEffect, useState } from "react";
import ChallengePage from "./ChallengePage";
import { defaultRules, addRule } from "../../util/rules";

function TwoTCPersonStats() {
    const [apiResult, setApiResult] = useState(null);

    const [isOG, setOG] = useState(false);

    useEffect(() => {
        setApiResult(null);
        fetch(`/fetch-2tc-person-counts?limit=10&og=${isOG ? 1 : 0}`).then(async (res) => {
            setApiResult(await res.json());
        });
    }, [isOG]);

    return <>
        <h2>Top 10 Leaderboard</h2>
        <input type="checkbox" id="og" name="og" onChange={e => setOG(e.target.checked)} checked={isOG} />
        <label htmlFor="og">OG only?</label>
        {apiResult !== null && <div className="tableContainer">
            <table>
                <thead>
                    <tr>
                        <th>Person</th>
                        <th># of Completions</th>
                        {!isOG && <>
                            <th># of Maps Completed</th>
                            <th>Most Completed Map</th>
                        </>}
                    </tr>
                </thead>
                <tbody>
                    {apiResult.personData.map(data => <tr key={data.person}>
                        <td>{data.person}</td>
                        <td>{data.count}</td>
                        {!isOG && <>
                            <td>{data.uniquecount}</td>
                            <td>{data.favoritemap}</td>
                        </>}
                    </tr>)}
                </tbody>
            </table>
        </div> }
    </>;
}

export default function TwoTC() {
    const [allRules, setAllRules] = useState(defaultRules);
    
    useEffect(() => {
        setAllRules(a => [...addRule(a, {
            name: 'Tower Limitations', 
            rule: <div>
                    <h2>Tower Limitations</h2>
                    <p>Towers that have successfully soloed CHIMPS mode with $650 starting cash in the past or currently are <strong>not</strong> allowed. As of now, this includes <strong>Sauda</strong> and <strong>Geraldo</strong>.</p>
                </div>,
        })]);

        setAllRules(a => [...addRule(a, {
            name: 'Tower Restrictions', 
            rule: <div>
                <h2>Tower and Hero Restrictions</h2>
                <p>Exclude all unused towers from your selection. The towers' path and crosspath need to be restricted. When using heroes, you must not select the "selected hero" option.</p>
            </div>,
        })]);
    }, [])

    return <ChallengePage
    challenge="2tc"
    header="2 Towers CHIMPS"
    description="In this challenge, win a game of CHIMPS with buying exactly two towers (including heroes and excluding towers/heroes that have, in the past or currently, solo CHIMPS as a single tower)."
    fieldHeaders={['Tower 1', 'Tower 2']}
    fields={['tower1', 'tower2']}
    auxFields={['version', 'date']}
    auxFieldHeaders={['OG Version', 'OG Date']}
    fieldDisplayFunc={({ fieldName, fieldValue, completion }) => {
        if ((fieldName === 'version' || fieldName === 'date') && !completion.og) {
            return 'N/A';
        }
        return fieldValue || 'N/A';
    }}
    hasVersion
    rules={allRules}
    alternateFormats={{"Person Stats": TwoTCPersonStats}}
    />
};