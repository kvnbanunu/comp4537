const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, '../database.sqlite');

const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
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

// Predefined patients data
const predefinedPatients = [
    ['Sara Brown', '1901-01-01'],
    ['John Smith', '1941-01-01'],
    ['Jack Ma', '1961-01-30'],
    ['Elon Musk', '1999-01-01']
];

// Function to insert predefined patients
function insertPredefinedPatients() {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO patient (name, dateOfBirth) VALUES (?, ?)';
        
        // Use a transaction for multiple inserts
        db.serialize(() => {
            db.run('BEGIN TRANSACTION');
            
            const stmt = db.prepare(query);
            let success = true;
            
            predefinedPatients.forEach(patient => {
                stmt.run(patient, (err) => {
                    if (err) {
                        console.error('Error inserting patient:', err);
                        success = false;
                    }
                });
            });
            
            stmt.finalize();
            
            db.run('COMMIT', (err) => {
                if (err || !success) {
                    reject(new Error('Failed to insert predefined patients'));
                } else {
                    resolve({ 
                        success: true, 
                        message: 'Patients inserted successfully',
                        count: predefinedPatients.length 
                    });
                }
            });
        });
    });
}

// Function to execute custom queries
function executeQuery(query) {
    return new Promise((resolve, reject) => {
        if (!isValidQuery(query)) {
            reject(new Error('Invalid query type. Only SELECT and INSERT queries are allowed.'));
            return;
        }

        if (query.toUpperCase().startsWith('SELECT')) {
            db.all(query, [], (err, rows) => {
                if (err) {
                    reject(new Error('Query execution failed: ' + err.message));
                } else {
                    resolve({ success: true, results: rows });
                }
            });
        } else { // INSERT query
            db.run(query, [], function(err) {
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
    insertPredefinedPatients,
    executeQuery
};
