import ChallengePage from "./ChallengePage";

export default function LTC() {
    return <ChallengePage
        challenge="ltc"
        header="Least Towers CHIMPS"
        description="In this challenge, win a game of CHIMPS with the fewest amount of towers (including heroes)."
        fieldHeaders={['Map']}
        fields={['map']}
        altFields={['towerset']}
        altFieldHeaders={['Towers']}
        auxFieldHeaders={['Upgrades', 'Version', 'Date']}
    />
}