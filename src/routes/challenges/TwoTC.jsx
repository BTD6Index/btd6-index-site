import ChallengePage from "./ChallengePage"

export default function TwoTC() {
    return <ChallengePage
    challenge="2tc"
    header="2 Towers CHIMPS"
    description="In this challenge, win a game of CHIMPS with buying exactly two towers (including heroes and excluding towers/heroes that have, in the past or currently, solo CHIMPS as a single tower)."
    fieldHeaders={['Tower 1', 'Tower 2']}
    fields={['tower1', 'tower2']}
    auxFields={['version', 'date']}
    auxFieldHeaders={['OG Version', 'OG Date']}
    fieldDisplayFunc={({ fieldName, fieldValue, completion }) => {
        if ((fieldName === 'version' || fieldName === 'date') && !completion.og) {
            return 'N/A';
        }
        return fieldValue || 'N/A';
    }}
    />
};