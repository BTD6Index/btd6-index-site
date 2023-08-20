import ChallengePage from "./ChallengePage"

export default function TwoTCC() {
    return <ChallengePage
    challenge="2tcc"
    header="2 Towers Co-op CHIMPS"
    description={
        <>
            In this challenge, win a game of <strong>co-op</strong> (with 2 real players) CHIMPS with buying exactly two towers
            (including heroes and excluding towers/heroes that have, in the past or currently, solo CHIMPS as a single tower).
        </>
    }
    fieldHeaders={['Tower 1', 'Tower 2']}
    fields={['tower1', 'tower2']}
    personFields={['person1', 'person2']}
    personFieldHeaders={['Person 1', 'Person 2']}
    />
};