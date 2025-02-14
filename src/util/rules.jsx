export const defaultRules = [
    {
        name: 'Challenge Settings',
        rule: <div>
                <h2>Challenge Settings</h2>
                <ul>
                    <li>The Challenge Editor should be set to the hard difficulty and CHIMPS mode.</li> 
                    <li>Starting Cash, Starting Lives, Max Lives, Start Round, and End Round must be set to their default values.</li> 
                    <li>The end round must strictly be set to Round 100.</li>
                    <li>The "Least Cash" condition should be set to "No Score Set" (or 99999999 through clicking the auto button twice which does the same thing without needing a reset); this is mainly to prevent exploiting of extreme cash bugs. You can reset the score after completing a run by clicking the auto button twice.</li>
                    <li>All sliders must be set to 100%.</li>
                    <li>All check boxes at the bottom must remain unchecked.</li>
                </ul>
            </div>,
    },
    {
        name: 'Submission Requirements',
        rule: <div>
                <h2>Submission Requirements</h2>
                <p>Victory Screen screenshots alone are insufficient for inclusion in The Index. You must also provide a screenshot of the final tower setup. You must provide a challenge code that reflects the limitations and specifications outlined in the rule of this challenge.</p>
            </div>,
    },
    {
        name: 'Hard Rounds',
        rule: <div>
                <h2>Hard Round Recordings</h2>
                <p>For the successful completion of a submission, recordings of gameplay during hard rounds are mandatory.</p>
            </div>,
    },
    {
        name: 'Proof',
        rule: <div>
                <h2>Proof</h2>
                <p>If a helper from the community requests recordings of a particular round, you will have 48 hours to provide the requested footage. Failure to do so within this timeframe may result in a temporary suspension or ban from future submissions.</p>
            </div>,
    },
    {
        name: 'Adora',
        rule: <div>
                <h2>Adora</h2>
                <p>Any run featuring Adora must include full recordings of gameplay.</p>
            </div>,
    },
    {
        name: 'Hard Maps',
                rule: <div>
                <h2>Hard Map Requirements</h2>
                <p>Any runs on Geared, Muddy Puddles, Bloody Puddles, #Ouch, Quad, Ravine, Dark Dungeons, X Factor, Glacial Trail, or Erosion, must include full recordings of gameplay.</p>
            </div>,
    },
    {
        name: 'Fair Play',
        rule: <div>
                <h2>Fair Play and Game Integrity</h2>
                <p>No game modification, hacking, or unauthorized software use allowed. This includes the use of speedhacks and any other alterations that deviate from the game's original mechanics and settings. Violation leads to disqualification and potential exclusion from future challenges.</p> 
            </div>,
    },
    {
        name: 'Past Versions',
        rule: <div>
                <h2>Past Versions</h2>
                <p>The Exception to the Fair Play rule is using past versions. <strong>Previously</strong> past versions were banned, but <strong>now</strong> if a combo isn't already completed you are allowed to submit from past versions.</p>
            </div>,
    },
    {
        name: 'Discord Bans',
        rule: <div>
                <h2>Discord Bans</h2>    
                <p>You may not submit if you are banned from the BTD6 Index Discord Server.</p>
            </div>,
    },
    {
        name: 'Cheating',
        rule: <div>
                <h2>Cheating</h2>
                <p>If you are caught cheating your runs will be removed from the BTD6 Index and others will be allowed to recomplete them.</p>
            </div>,
    },
]

export function addRule(rules, adde){
    return [adde, ...rules];
}

export function editRule(rules, edite, edit){
    return rules.map(element => {if(element.name === edite){element = edit}return element;});
}

export function deleteRule(rules, deletee){
    return rules.filter(element => {return element.name !== deletee});
}