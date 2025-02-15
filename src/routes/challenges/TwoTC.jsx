import { useEffect, useState, useRef } from "react";
import ChallengePage from "./ChallengePage";
import { defaultRules, addRule } from "../../util/rules";

export default function TwoTC() {
    const effectRan = useRef(false);
    const [allRules, setAllRules] = useState(defaultRules);
    
    useEffect(() => {
        if(effectRan.current === true){
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
        }
        return () => {effectRan.current = true}
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
    />
};