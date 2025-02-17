function validateQuery(sql) {
    const upperQuery = sql.toUpperCase();
    if (!upperQuery.startsWith('SELECT') && !upperQuery.startsWith('INSERT')) {
        return false;
    }

    // check if query contains any blocked keywords
    const blocked = ['UPDATE', 'DELETE', 'DROP', 'TRUNCATE', 'ALTER', 'MODIFY'];
    return !blocked.some(keyword => upperQuery.includes(keyword));
}

function selectOrInsert(sql) {
    const upperQuery = sql.toUpperCase();
    if (upperQuery.startsWith('SELECT')) {
        return 'SELECT';
    }
    return 'INSERT';
}

module.exports = {
    validateQuery,
    selectOrInsert,
}
