import PageTitle from "../../../util/PageTitle";

export default function LTCRules() {
    return <>
        <p><a href="/ltc">Back to LTCs</a></p>
        <PageTitle>Rules for LTC</PageTitle>
        <h2>Challenge Settings</h2>
        <p>
            The Challenge Editor should be set to the hard difficulty and CHIMPS mode.
            Starting Cash, Starting Lives, Max Lives, Start Round, and End Round must be set to their default values.
            The end round must strictly be set to Round 100.
            The "Least Cash" condition should be set to "No Score Set" (or 99999999 through clicking the auto button twice which does the same thing without needing a reset); this is mainly to prevent exploiting of cash bugs. You can reset the score after completing a run by clicking the auto button twice.
            All sliders must be set to 100%.
            All check boxes at the bottom must remain unchecked.
        </p>
        <h2>Tower and Hero Restrictions</h2>
        <p>
            Exclude all unused towers from your selection.
            The towers' path and crosspath need to be restricted.
            When using heroes, you must not select the "selected hero" option.
        </p>
        <h2>Alternate Tower Combinations</h2>
        <p>
            <strong>
                For each map, only the earliest (OG) and cheapest sets of towers that beat CHIMPS
                with the fewest amount of towers in the latest game version are counted.
            </strong>
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
        </p>
    </>;
}