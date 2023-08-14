import ChallengePage from "./ChallengePage"

export default function TwoMPC() {
    return <ChallengePage
    challenge="2tc"
    header="2 Towers CHIMPS"
    description="In this challenge, win a game of CHIMPS with buying exactly two towers (including heroes)."
    fieldHeaders={['Tower 1', 'Tower 2']}
    fields={['tower1', 'tower2']}
    />
};