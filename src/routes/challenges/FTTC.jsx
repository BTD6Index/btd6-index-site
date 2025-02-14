import { useCallback, useRef, useEffect, useState } from "react";
import ChallengePage from "./ChallengePage"
import { defaultRules, addRule, deleteRule } from "../../util/rules";

export default function FTTC() {
    const fieldDisplayFunc = useCallback(({fieldName, fieldValue}) => {
        try {
            if (fieldName === 'towerset') {
                return JSON.parse(fieldValue).join(', ')
            }
        } catch (e) {
            if (e instanceof SyntaxError) {
                // don't break the program on invalid towerset format
                // but instead log an error
                console.error(e);
            } else {
                // throw for everything else
                throw e;
            }
        }
        return fieldValue;
    }, []);

    const effectRan = useRef(false);
    const [allRules, setAllRules] = useState(defaultRules);
        
    useEffect(() => {
        if(effectRan.current === true){
            setAllRules(a => [...addRule(a, {
                name: 'Tower Limitations', 
                rule: <div>
                    <h2>Tower Limitations</h2>
                    <p>Heroes are <strong>not</strong> allowed!</p>
                    <p>All other towers are fair game.</p>
                </div>,
            })]);

            setAllRules(a => [...addRule(a, {
                name: 'Tower Restrictions', 
                rule: <div>
                        <h2>Tower and Hero Restrictions</h2>
                        <p>Exclude all unused tower types (including all heroes) from your selection.</p>
                    </div>,
            })]);

            setAllRules(a => [...deleteRule(a, 'Adora')]);
        }
        return () => {effectRan.current = true}
    }, [])

    return <ChallengePage
        challenge="fttc"
        header="Fewest Types of Towers CHIMPS"
        description="In this challenge, win a game of CHIMPS with no heroes and the smallest number of tower types."
        fieldHeaders={['Map', 'Tower Types']}
        fields={['map', 'towerset']}
        altFieldHeaders={[]}
        altFields={[]}
        fieldDisplayFunc={fieldDisplayFunc}
        rules={allRules}
    />
};