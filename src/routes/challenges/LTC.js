import ChallengePage from "./ChallengePage";
import { useCallback } from "react";

export default function LTC() {
    const fieldDisplayFunc = useCallback(({fieldName, fieldValue}) => {
        try {
            if (['towerset', 'upgradeset'].includes(fieldName)) {
                return JSON.parse(fieldValue)?.map(v => v ?? 'N/A')?.join(', ') ?? 'N/A';
            }
        } catch (e) {
            if (e instanceof SyntaxError) {
                // don't break the program on invalid towerset format
                // but instead log an error
                console.error(e);
            } else {
                // throw for everything else
                throw e;
            }
        }
        return fieldValue ?? 'N/A';
    }, []);
    return <ChallengePage
        challenge="ltc"
        header="Least Towers CHIMPS"
        description="In this challenge, win a game of CHIMPS with the fewest amount of towers (including heroes)."
        fieldHeaders={['Map']}
        fields={['map']}
        altFields={['towerset', 'completiontype']}
        altFieldHeaders={['Towers', 'Completion Type']}
        auxFieldHeaders={['Upgrades', 'Version', 'Date']}
        auxFields={['upgradeset', 'version', 'date']}
        fieldDisplayFunc={fieldDisplayFunc}
        disableOG
    />
}