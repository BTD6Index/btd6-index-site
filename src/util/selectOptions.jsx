import towerNames from './tower-names.json';
import heroNames from './heroes.json';
import towersAffordableAtStart from './towersAffordableAtStart.json'
import { useEffect, useState } from 'react';

const towerToOptions = new Map(
    Object.values(towerNames)
        .flatMap(entries => Object.values(entries)).concat(Object.keys(heroNames))
        .map(entry => [entry, { value: entry, label: entry }])
);

const startingTowerToOptions = new Map(
    Object.entries(towerNames)
        .filter(([towerName, ]) => towersAffordableAtStart.includes(towerName))
        .map(([,towerUpgrades]) => towerUpgrades)
        .flatMap(entries => Object.values(entries)).concat(Object.keys(heroNames).filter(heroName => towersAffordableAtStart.includes(heroName)))
        .map(entry => [entry, { value: entry, label: entry }])
);

const towerTypeToOptions = new Map(
    Object.keys(towerNames)
        .map(key => [key, { value: key, label: key }])
);

const heroToOptions = new Map(
    Object.keys(heroNames)
        .map(key => [key, { value: key, label: key }])
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
                    new Map(mapsList.results.map(mapName => [mapName, { value: mapName, label: mapName }]))
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
                    new Map(odysseysList.results.map(odysseyName => [odysseyName, { value: odysseyName, label: odysseyName }]))
                );
            });
    }, [reloadVar]);
    return odysseyToOptions;
}

export { towerToOptions, startingTowerToOptions, useMapToOptions, towerTypeToOptions, useOdysseyToOptions, towerTypeAndHeroToOptions, heroToOptions };
