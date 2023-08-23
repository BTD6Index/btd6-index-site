import ChallengePage from "./ChallengePage"

export default function TwoTCC() {
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
    auxFields={['person1', 'person2']}
    auxFieldHeaders={['Player 1', 'Player 2']}
    />
};