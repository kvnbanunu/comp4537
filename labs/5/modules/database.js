const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database configuration
const DB_PATH = path.join(__dirname, '../database.sqlite');

// Create database connection
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Connected to SQLite database');
        initDatabase();
    }
});

// Initialize database schema
function initDatabase() {
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

// Function to validate SQL query
function isValidQuery(query) {
    const upperQuery = query.toUpperCase();
    // Only allow SELECT and INSERT queries
    if (!upperQuery.startsWith('SELECT') && !upperQuery.startsWith('INSERT')) {
        return false;
    }
    // Block potentially dangerous operations
    const blockedKeywords = ['UPDATE', 'DELETE', 'DROP', 'TRUNCATE', 'ALTER', 'MODIFY'];
    return !blockedKeywords.some(keyword => upperQuery.includes(keyword));
}

// Function to execute queries
function executeQuery(query, params = []) {
    return new Promise((resolve, reject) => {
        if (!isValidQuery(query)) {
            reject(new Error('Invalid query type. Only SELECT and INSERT queries are allowed.'));
            return;
        }

        if (query.toUpperCase().startsWith('SELECT')) {
            db.all(query, params, (err, rows) => {
                if (err) {
                    reject(new Error('Query execution failed: ' + err.message));
                } else {
                    resolve({ success: true, results: rows });
                }
            });
        } else { // INSERT query
            db.run(query, params, function(err) {
                if (err) {
                    reject(new Error('Query execution failed: ' + err.message));
                } else {
                    resolve({ 
                        success: true, 
                        results: { 
                            lastID: this.lastID, 
                            changes: this.changes 
                        }
                    });
                }
            });
        }
    });
}

module.exports = {
    db,
    executeQuery
};
