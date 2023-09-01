import ChallengePage from "./ChallengePage";

export default function LCC() {
    return <ChallengePage
        challenge="lcc"
        header="Least Cost CHIMPS"
        description="In this challenge, win a game of CHIMPS with the smallest amount of cash spent."
        fieldHeaders={['File Key']}
        fields={['filekey']}
        altFields={[]}
        altFieldHeaders={[]}
        fieldsInvisible
        auxFields={['map', 'money', 'version', 'date']}
        auxFieldHeaders={['Map', 'Cost', 'Version', 'Date']}
        disableOG
    />;
}
