import { useState } from "react";

export default function useTristateList(initial = {}) {
    const [list, setList] = useState(initial);
    const toggleElement = (elem) => {
        setList(state => {
            let newState = {...state};
            switch (state[elem]) {
                case true:
                    newState[elem] = false;
                    break;
                case false:
                    delete newState[elem];
                    break;
                default:
                    newState[elem] = true;
                    break;
            }
            return newState;
        });
    };
    return {
        list, setList, toggleElement
    }
}