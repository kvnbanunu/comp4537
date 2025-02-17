const http = require('http');
const url = require('url');
const mysql = require('mysql');
const TEXT = require('./modules/text');
const DBFUNC = require('./modules/database');
require('dotenv').config();

const PATH = '/sql';

const CONTENT = {
    json: "application/json",
    html: "text/html",
    text: "text/plain"
}

const RESCODE = {
    success: 200,
    created: 201,
    noCont: 204,
    badReq: 400,
    notFound: 404,
    notAllowed: 405,
    intErr: 500
}

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        process.exit(1);
    }
    console.log('Connected to MySQL database');
    initDatabase((err) => {
        if (err) {
            console.error('Failed to initialize database:', err);
            process.exit(1);
        }
    });
});

const server = http.createServer(async (req, res) => {
    const parsed = url.parse(req.url, true);
    const path = parsed.pathname;
    const query = parsed.query;

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(RESCODE.noCont);
        res.end();
        return;
    }

    if (path === PATH) {
        try {
            if (req.method === 'GET') {
                handleGetReq(req, res, query);
            } else if (req.method === 'POST') {
                await handlePostReq(req, res);
            } else {
                sendError(res, RESCODE.notAllowed, TEXT.notAllowed);
            }
        } catch (error) {
            sendError(res, RESCODE.intErr, TEXT.intErr);
        }
    } else {
        sendError(res, RESCODE.notFound, TEXT.notFound);
    }
});

function initDatabase() {
    const sql = `
        CREATE TABLE IF NOT EXISTS patient (
            patientid INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            dateOfBirth DATETIME NOT NULL
        )
    `;
    
    db.query(sql, (err) => {
        if (err) {
            console.error('Error initializing database:', err);
            return;
        }
        console.log('Database initialized successfully');
    });
}

function handleGetReq(req, res, query) {
    if (!query.query) {
        sendError(res, RESCODE.badReq, TEXT.badReq);
        return;
    }

    if (!DBFUNC.validateQuery(query.query) || DBFUNC.selectOrInsert(query.query) !== 'SELECT') {
        sendError(res, RESCODE.badReq, TEXT.invQuery);
        return;
    }

    db.query(query.query, [], (err, result) => {
        if (err) {
            sendError(res, RESCODE.intErr, TEXT.dbErr);
            return;
        }
        sendJSON(res, RESCODE.success, result);
    });
}

async function handlePostReq(req, res) {
    const body = await readReqBody(req);
    if (!body) {
        sendError(res, RESCODE.badReq, TEXT.invQuery);
        return;
    }
    
    if (!DBFUNC.validateQuery(body.query) || DBFUNC.selectOrInsert(body.query) !== 'INSERT') {
        sendError(res, RESCODE.badReq, TEXT.invQuery);
        return;
    }

    db.query(body.query, [], (err, result) => {
        if (err) {
            sendError(res, RESCODE.intErr, TEXT.dbErr);
            return;
        }
        sendJSON(res, RESCODE.created, { message: TEXT.created, result });
    });
}

function readReqBody(req) {
    return new Promise((resolve, reject) => {
        let data = '';

        req.on('data', chunk => {
            data += chunk.toString();
        });

        req.on('end', () => {
            try {
                resolve(JSON.parse(data));
            } catch (err) {
                resolve(null);
            }
        });

        req.on('error', reject);
    })
}

function sendJSON(res, status, data) {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
}

function sendError(res, status, message) {
    sendJSON(res, status, { error: message });
}

function shutdown() {
    server.close(() => {
        db.end(() => {
            process.exit(0);
        });
    });
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

server.listen(process.env.PORT);

// handle server err
server.on('error', (error) => {
    console.error('Server error:', error);
});
