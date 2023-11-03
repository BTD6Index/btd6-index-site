import { useCallback } from "react";
import ChallengePage from "./ChallengePage"

export default function FTTC() {
    const fieldDisplayFunc = useCallback(({fieldName, fieldValue}) => {
        try {
            if (fieldName === 'towerset') {
                return JSON.parse(fieldValue).join(', ')
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
        return fieldValue;
    }, []);
    return <ChallengePage
        challenge="fttc"
        header="Fewest Types of Towers CHIMPS"
        description="In this challenge, win a game of CHIMPS with no heroes and the smallest number of tower types."
        fieldHeaders={['Map', 'Tower Types']}
        fields={['map', 'towerset']}
        altFieldHeaders={[]}
        altFields={[]}
        fieldDisplayFunc={fieldDisplayFunc}
    />
};