import { useCallback, useState, useEffect } from "react";
import ChallengePage from "./ChallengePage"
import { defaultRules, addRule, editRule, deleteRule } from "../../util/rules";

export default function LTO() {
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

    const [allRules, setAllRules] = useState(defaultRules);

    useEffect(() => {
        setAllRules(a => [...addRule(a, {
            name: 'Tower Counts',
            rule: <div>
                <h2>Tower Counts</h2>
                    <ul>
                        <li>Every Hero counts as exactly 1 tower regardless of if you placed them 5 times. </li>
                        <li>Placing a tower, lets say a Dart Monkey, used as Crossbow on Maps 1 and 2, and Ultra-Juggernaut on Maps 3-5, only counts as 1 Tower.</li>
                        <li>On Extreme Odysseys, Placing a tower, lets say a Dart Monkey, used as Crossbow on Maps 1 and 2, and Ultra-Juggernaut on Maps 3-4, and Plasma Monkey Fan Club on Map 5, would count as 5 separate Towers.</li>
                    </ul>
            </div>
        })])

        setAllRules(a => [...addRule(a, {
            name: 'p2w',
            rule: <div>
                    <h2>Powers, Continues, Double Cash, Hero Boosters, and Fast Track</h2>
                    <p>All Monkey Powers, Continues, Double Cash, Hero Boosters, and Fast Tracks are not allowed for LTO.</p>
            </div>
        })])

        setAllRules(a => [...addRule(a, {
            name: 'Income',
            rule: <div>
                    <h2>Income</h2>
                    <p>All form of extra income, that come from a tower, such as Pirate Lord, XXXL Trap, Spirit of the Forest, etc., are allowed for LTO.</p>
            </div>
        })])

        setAllRules(a => [...addRule(a, {
            name: 'Selling',
            rule: <div>
                    <h2>Selling</h2>
                    <p>Selling and Rebuying is allowed for LTO, but if you have for example 2 darts on the screen at once, that counts as 2 towers.</p>
                </div>
        })])

        setAllRules(a => [...addRule(a, {
            name: 'Monkey Knowledge',
            rule: <div>
                    <h2>Monkey Knowledge</h2>
                    <p>Monkey Knowledge is allowed for LTO.</p>
                </div>,
        })])

        setAllRules(a => [...editRule(a, 'Submission Requirements', {
            name: 'Submission Requirements',
            rule: <div>
                    <h2>Submission Requirements</h2>
                    <p>You must also provide a screenshot of the <strong>ODYSSEY COMPLETE</strong> screen showing the number of towers you used.</p>
                </div>,
        })])

        setAllRules(a => [...deleteRule(a, 'Challenge Settings')])
        setAllRules(a => [...deleteRule(a, 'Hard Rounds')])
    }, [])

    return <ChallengePage
        challenge="lto"
        header="Least Tower Odyssey"
        description="In this challenge, beat an odyssey with the least number of towers"
        fieldHeaders={['Odyssey', 'Towers']}
        fields={['odysseyName', 'towerset']}
        altFieldHeaders={[]}
        altFields={[]}
        fieldDisplayFunc={fieldDisplayFunc}
        rules={allRules}
    />
};