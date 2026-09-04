function processQuery(query, validColumns) {
    // For PostgreSQL full-text search, we use plainto_tsquery which handles tokenization
    // and joins terms with OR logic by default
    return query
    .split(/\s+/).filter(token => !!token) // split into whitespace-separated tokens
    .map(token => {
        // e.g. map:QD
        /*
        let splitToken = token.split(':', 2);
        if (splitToken.length === 2 && validColumns.includes(splitToken[0])) {
            return `(${splitToken[0]} : "${splitToken[1].replace('"', '\\"')}" *)`;
        }*/
        return token.replace(/"/g, '\\"');
    })
    .join(' & '); // For PostgreSQL to_tsquery, we join with & for AND logic
}

export {processQuery};