export default function descendingVersionOrderSort(a, b, key = (v) => v) {
    let aInt = parseInt(key(a).split('.')[0].trim());
    let bInt = parseInt(key(b).split('.')[0].trim());
    return bInt - aInt; // sort by descending major version order
};
