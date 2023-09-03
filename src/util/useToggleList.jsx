import { useState } from "react";

export default function useToggleList(initial = []) {
    const [list, setList] = useState(initial);
    const toggleElement = (elem) => {
        setList(state => {
            if (state.includes(elem)) {
                return state.filter(cand => cand !== elem);
            } else {
                return [...state, elem];
            }
        });
    };
    const setElement = (elem, on) => {
        if (!on) {
            setList(state => state.filter(cand => cand !== elem));
        } else {
            setList(state => [...state, elem]);
        }
    };
    return {
        list,
        setList,
        toggleElement,
        setElement
    };
};