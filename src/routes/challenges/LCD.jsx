import ChallengePage from "./ChallengePage";

export default function LCD() {
    return <ChallengePage
        challenge="lcd"
        header="Least Cost Deflation"
        description="In this challenge, win a game of Deflation (no powers or continues) with the smallest amount of cash spent."
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
