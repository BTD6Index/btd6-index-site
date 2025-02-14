import ChallengePage from "./ChallengePage";
import { defaultRules, addRule, editRule } from "../../util/rules";
import { useEffect, useRef, useState } from "react";


export default function LCC() {
    const effectRan = useRef(false);
    const [allRules, setAllRules] = useState(defaultRules);
        
    useEffect(() => {
        if(effectRan.current === true){
            setAllRules(a => [...addRule(a, {
                id: 1, 
                name: 'Version Requirements', 
                rule: <div>
                        <h2>Version-Related Requirements</h2>
                        <p>Least Cost CHIMPS completions are tracked on a per-<strong>major</strong> version basis and can be submitted on any version.</p>
                    </div>,
            })]);

            setAllRules(a => [...editRule(a, 'Challenge Settings', {
                id: 101,
                name: 'Challenge Settings',
                rule: <div>
                        <h2>Challenge Settings</h2>
                        <ul>
                            <li>The Challenge Editor should be set to the hard difficulty and CHIMPS mode.</li>
                            <li>Starting Cash, Starting Lives, Max Lives, Start Round, and End Round must be set to their default values.</li> 
                            <li>The end round must strictly be set to Round 100.</li>
                            <li>The "Least Cash" condition should initially be set to "No Score Set". <strong>Unlike most other Index challenges, setting the condition to 99999999 cash is not allowed, as the challenge code needs to incorporate the cash spent.</strong></li>
                            <li>All sliders must be set to 100%.</li>
                            <li>All check boxes at the bottom must remain unchecked.</li>
                        </ul>
                    </div>,
            })])
        }
        return () => {effectRan.current = true}
    }, [])

    return <ChallengePage
        challenge="lcc"
        header="Least Cost CHIMPS"
        description="In this challenge, win a game of CHIMPS with the smallest amount of cash spent."
        fieldHeaders={['File Key']}
        fields={['filekey']}
        altFields={[]}
        altFieldHeaders={[]}
        fieldsInvisible
        auxFields={['map', 'money', 'version', 'date']}
        auxFieldHeaders={['Map', 'Cost', 'Version', 'Date']}
        disableOG
    />;
}
