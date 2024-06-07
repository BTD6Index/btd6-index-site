import { useCallback } from "react";
import ChallengePage from "./ChallengePage"

export default function LTO() {
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
        challenge="lto"
        header="Least Tower Odyssey"
        description="In this challenge, beat an odyssey with the least number of towers"
        fieldHeaders={['Odyssey', 'Towers']}
        fields={['odysseyName', 'towerset']}
        altFieldHeaders={[]}
        altFields={[]}
        fieldDisplayFunc={fieldDisplayFunc}
    />
};