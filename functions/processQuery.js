function processQuery(query, validColumns) {
    return query
    .split(/\s+/).filter(token => !!token) // split into whitespace-separated tokens
    .map(token => {
        // e.g. map:QD
        let splitToken = token.split(':', 2);
        if (splitToken.length == 2 && validColumns.includes(splitToken[0])) {
            return `(${splitToken[0]} : "${splitToken[1].replace('"', '\\"')}" *)`;
        }
        return `"${token.replace('"', '\\"')}" *`;
    })
    .join(' AND ');
}

export {processQuery};