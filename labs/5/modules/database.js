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

function initDatabase(db) {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS patient (
            patientid INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            dateOfBirth DATETIME NOT NULL
        )
    `;

    db.run(createTableQuery, (err) => {
        if (err) {
            console.error('Error creating table:', err);
        } else {
            console.log('Database initialized successfully');
        }
    });
}

module.exports = {
    initDatabase,
    validateQuery,
    selectOrInsert,
}
