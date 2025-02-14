import ChallengePage from "./ChallengePage"
import { defaultRules, addRule, editRule } from "../../util/rules";
import { useEffect, useRef, useState } from "react";

export default function TwoTCC() {
    const effectRan = useRef(false);
    const [allRules, setAllRules] = useState(defaultRules);
    
    useEffect(() => {
        if(effectRan.current === true){
            setAllRules(a => [...addRule(a, {
                id: 1, 
                name: 'Tower Limitations', 
                rule: <div>
                        <h2>Tower Limitations</h2>
                        <p>Pairs of towers that already beat single-player 2TC do <strong>not</strong> count as 2TCC.</p>
                        <p>Unlike single-player 2TC, Towers that have successfully soloed CHIMPS mode in the past or currently <strong>are</strong> allowed.</p>
                    </div>,
            })]);

            setAllRules(a => [...editRule(a, 'Challenge Settings', {
                id: 101,
                name: 'Challenge Settings',
                rule: <div>
                        <h2>Challenge Settings</h2>
                        <ul>
                            <li>Must be done in a real co-op game (not challenge editor with extra starting cash).</li>
                            <li>Each player must have 1 tower (one player cannot have both).</li>
                            <li>Using glitches to get extra cash per round is disallowed.</li>
                            <li>The bug where you can disconnect for a round-ish and reconnect, all while letting your partner micro 1 tower without lag, is disallowed.</li>
                        </ul>
                    </div>,
            })])

            setAllRules(a => [...editRule(a, 'Submission Requirements', {
                id: 101,
                name: 'Submission Requirements',
                rule: <div>
                        <h2>Submission Requirements</h2>
                        <p>Victory Screen screenshots alone are insufficient for inclusion in The Index. You must also provide a screenshot of the final tower setup.</p>
                    </div>,
            })])
        }
        return () => {effectRan.current = true}
    }, [])

    return <ChallengePage
    challenge="2tcc"
    header="2 Towers Co-op CHIMPS"
    description={
        <>
            In this challenge, win a game of <strong>co-op</strong> CHIMPS with buying exactly two towers
            (including heroes, and excluding pairs of towers/heroes that can do 2TC in singleplayer).
        </>
    }
    fieldHeaders={['Tower 1', 'Tower 2']}
    fields={['tower1', 'tower2']}
    personFields={['person1', 'person2']}
    personFieldHeaders={['Player 1', 'Player 2']}
    rules={allRules}
    />
};