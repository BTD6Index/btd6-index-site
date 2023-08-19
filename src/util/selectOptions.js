import towerNames from './tower-names.json';
import heroNames from './heroes.json';
import maps from './maps.json';

const towerToOptions = new Map(
    Object.values(towerNames)
        .flatMap(entries => Object.values(entries)).concat(Object.keys(heroNames))
        .map(entry => [entry, {value: entry, label: entry}])
);

const mapToOptions = new Map(
    Object.entries(maps)
        .map(entry => [entry[0], {value: entry[0], label: entry[0]}])
);

export {towerToOptions, mapToOptions};