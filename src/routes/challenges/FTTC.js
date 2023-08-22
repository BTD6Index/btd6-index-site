import { useCallback } from "react";
import ChallengePage from "./ChallengePage"

export default function FTTC() {
    const fieldDisplayFunc = useCallback((fieldName, fieldValue) => {
        if (fieldName === 'towerset') {
            return JSON.parse(fieldValue).join(', ')
        }
        return fieldValue;
    }, []);
    return <ChallengePage
        challenge="fttc"
        header="Fewest Types of Towers CHIMPS"
        description="In this challenge, win a game of CHIMPS with no heroes and the smallest number of tower types."
        fieldHeaders={['Map']}
        fields={['map']}
        altFields={['towerset']}
        altFieldHeaders={['Tower Types']}
        fieldDisplayFunc={fieldDisplayFunc}
    />
};