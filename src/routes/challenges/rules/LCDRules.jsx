import PageTitle from "../../../util/PageTitle";

export default function LCDRules() {
    return <>
        <p><a href="/lcd">Back to LCDs</a></p>
        <PageTitle>Rules for LCD</PageTitle>
        <h2>Challenge Settings</h2>
        <p>
            The Challenge Editor should be set to the easy difficulty and Deflation mode.
            Starting Cash, Starting Lives, Max Lives, Start Round, and End Round must be set to their default values.
            The end round must strictly be set to Round 60.
            The "Least Cash" condition should initially be set to "No Score Set".
            <strong> Unlike most other Index challenges, setting the condition to 99999999 cash is not allowed, as the challenge code needs to incorporate the cash spent. </strong>
            All sliders must be set to 100%.
            Monkey Knowledge is allowed, but no powers, continues, or <strong>selling</strong> are allowed.
        </p>
        <h2>Version-Related Requirements</h2>
        <p>
            Least Cost Deflation completions are independent of version and can be submitted on any version.
        </p>
        <h2>Submission Requirements</h2>
        <p>
            Victory Screen screenshots alone are insufficient for inclusion in The Index. You must also provide a screenshot of the final tower setup.
            You must provide a challenge code that reflects the limitations and specifications outlined in the rules of this challenge.
        </p>
        <h2>Hard Round Recordings</h2>
        <p>
            For the successful completion of a submission, recordings of gameplay during hard rounds are mandatory. If a helper from the community requests recordings of a particular round, you will have 48 hours to provide the requested footage. Failure to do so within this timeframe may result in a temporary suspension or ban from future submissions.
            Additionally, any runs featuring Adora must include full recordings of gameplay.
        </p>
        <h2>Fair Play and Game Integrity</h2>
        <p>
            No game modification, hacking, or unauthorized software use allowed. This includes the use of speedhacks and any other alterations that deviate from the game's original mechanics and settings. Violation leads to disqualification and potential exclusion from future challenges.
            You may not submit if you are banned from the BTD6 Index Discord Server. 
        </p>
    </>;
}
