import PageTitle from "../../../util/PageTitle";

export default function TwoMPRules() {
    return <>
        <p><a href="/2mp">Back to 2MPs</a></p>
        <PageTitle>Rules for 2MP</PageTitle>
        <h2>Challenge Settings</h2>
        <p>
            The Challenge Editor should be set to the hard difficulty and CHIMPS mode.
            Starting Cash, Starting Lives, Max Lives, Start Round, and End Round must be set to their default values.
            The end round must strictly be set to Round 100.
            The "Least Cash" condition should be set to "No Score Set" (or 99999999 through clicking the auto button twice which does the same thing without needing a reset); this is mainly to prevent exploiting of cash bugs. You can reset the score after completing a run by clicking the auto button twice.
            All sliders must be set to 100%.
            All check boxes at the bottom must remain unchecked.
        </p>
        <h2>Submission Requirements</h2>
        <p>
            Victory Screen screenshots alone are insufficient for inclusion in The Index. You must also provide a screenshot of the final tower setup (with the 2MP'ed tower selected unless something like the Covered Garden covers prevents this).
        </p>
        <h2>Hard Round Recordings</h2>
        <p>
            For the successful completion of a submission, recordings of gameplay during hard rounds are mandatory. If a helper from the community requests recordings of a particular round, you will have 48 hours to provide the requested footage. Failure to do so within this timeframe may result in a temporary suspension or ban from future submissions.
            Additionally, any runs featuring Adora, as well as any runs on Geared, either of the Puddles maps, #Ouch, Quad, Ravine, Dark Dungeons, X Factor, or Erosion, must include full recordings of gameplay.
        </p>
        <h2>Fair Play and Game Integrity</h2>
        <p>
            No game modification, hacking, or unauthorized software use allowed. This includes the use of speedhacks and any other alterations that deviate from the game's original mechanics and settings. Violation leads to disqualification and potential exclusion from future challenges.
        </p>
    </>;
}