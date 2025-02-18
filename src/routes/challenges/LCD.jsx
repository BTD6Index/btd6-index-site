import { useEffect, useState } from "react";
import ChallengePage from "./ChallengePage";
import { defaultRules, addRule, deleteRule, editRule } from "../../util/rules";

export default function LCD() {
    const [allRules, setAllRules] = useState(defaultRules);
    
    useEffect(() => {
        setAllRules(a => [...addRule(a, {
            name: 'Version Requirements', 
            rule: <div>
                    <h2>Version-Related Requirements</h2>
                    <p>Least Cost Deflation completions are independent of version and can be submitted on any version.</p>
                </div>,
        })]);

        setAllRules(a => [...editRule(a, 'Challenge Settings', {
            name: 'Challenge Settings',
            rule: <div>
                    <h2>Challenge Settings</h2>
                    <ul>
                        <li>The Challenge Editor should be set to the easy difficulty and Deflation mode. </li>
                        <li>Starting Cash, Starting Lives, Max Lives, Start Round, and End Round must be set to their default values.</li> 
                        <li>The end round must strictly be set to Round 60.</li>
                        <li>The "Least Cash" condition should initially be set to "No Score Set". <strong>Unlike most other Index challenges, setting the condition to 99999999 cash is not allowed, as the challenge code needs to incorporate the cash spent.</strong></li>
                        <li>All sliders must be set to 100%.</li>
                        <li>Monkey Knowledge is allowed, but no powers, continues, or <strong>selling</strong> are allowed.</li>
                    </ul>
                </div>,
        })])
            
        setAllRules(a => [...deleteRule(a, 'Adora')])
    }, [])

    return <ChallengePage
        challenge="lcd"
        header="Least Cost Deflation"
        description="In this challenge, win a game of Deflation (no powers or continues) with the smallest amount of cash spent."
        fieldHeaders={['File Key']}
        fields={['filekey']}
        altFields={[]}
        altFieldHeaders={[]}
        fieldsInvisible
        auxFields={['map', 'money', 'version', 'date']}
        auxFieldHeaders={['Map', 'Cost', 'Version', 'Date']}
        disableOG
        rules={allRules}
    />;
}
