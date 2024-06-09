//tower-names.json blanked and line 2 redirected from import towerNames from './tower-names.json'; to import towerNames from '../../functions/tower-names.json'; so site would load properly*/
import towerNames from '../../functions/tower-names.json';
import heroNames from './heroes.json';
import { useEffect, useState } from 'react';

const towerToOptions = new Map(
    Object.values(towerNames)
        .flatMap(entries => Object.values(entries)).concat(Object.keys(heroNames))
        .map(entry => [entry, {value: entry, label: entry}])
);

const towerTypeToOptions = new Map(
    Object.keys(towerNames)
    .map(key => [key, {value: key, label: key}])
);

const heroToOptions = new Map(
    Object.keys(heroNames)
    .map(key => [key, {value: key, label: key}])
);

const towerTypeAndHeroToOptions = new Map(
    [...towerTypeToOptions, ...heroToOptions]
);

function useMapToOptions(reloadVar = false) {
    const [mapToOptions, setMapToOptions] = useState(new Map());

    useEffect(() => {
        fetch('/list-maps')
        .then(async (res) => {
            let mapsList = await res.json();
            setMapToOptions(
                new Map(mapsList.results.map(mapName => [mapName, {value: mapName, label: mapName}]))
            );
        });
    }, [reloadVar]);
    return mapToOptions;
}

function useOdysseyToOptions(reloadVar = false) {
    const [odysseyToOptions, setOdysseyToOptions] = useState(new Map());

    useEffect(() => {
        fetch('/list-odysseys')
        .then(async (res) => {
            let odysseysList = await res.json();
            setOdysseyToOptions(
                new Map(odysseysList.results.map(odysseyName => [odysseyName, {value: odysseyName, label: odysseyName}]))
            );
        });
    }, [reloadVar]);
    return odysseyToOptions;
}

export {towerToOptions, useMapToOptions, towerTypeToOptions, useOdysseyToOptions, towerTypeAndHeroToOptions, heroToOptions};
