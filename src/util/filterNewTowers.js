import { towerTypeAndHeroToOptions } from "./selectOptions";
import addedLaterTowers from "./addedLaterTowers.json";

export default function filterNewTowers(startDate, filter){
    let newTowers = [], allTowers = [], oldTowers = allTowers;
    [...towerTypeAndHeroToOptions.values()].forEach(element =>{
        allTowers.push(element.value);
    })

    for (const [key, value] of Object.entries(addedLaterTowers)) {
        if(new Date(startDate).getTime() < new Date(value).getTime()){
            newTowers.push(key)
        }
    }

    newTowers.forEach(element => {
        oldTowers.splice(oldTowers.indexOf(element), 1);
    });

    if (filter === 'towers') oldTowers = oldTowers.slice(0, oldTowers.indexOf('Quincy'));
    if (filter === 'heroes') oldTowers = oldTowers.slice(oldTowers.indexOf('Quincy'));

    return(oldTowers);    
}