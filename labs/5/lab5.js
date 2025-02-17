const http = require('http');
const url = require('url');
const sqlite3 = require('sqlite3').verbose();
const TEXT = require('./modules/text');
const DBFUNC = require('./modules/database');
require('dotenv').config();

const PATH = '/sql';

const RESCODE = {
    success: 200,
    created: 201,
    noCont: 204,
    badReq: 400,
    notFound: 404,
    notAllowed: 405,
    intErr: 500
}

const db = new sqlite3.Database(process.env.DB_FILE || './database.sqlite', (err) => {
    if (err) {
        console.error('Error connecting to SQLite database:', err);
        return;
    }
    console.log('Connected to SQLite database');
});

DBFUNC.initDatabase(db);

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

function handleGetReq(req, res, query) {
    if (!query.query) {
        sendError(res, RESCODE.badReq, TEXT.badReq);
        return;
    }

    if (!DBFUNC.validateQuery(query.query) || DBFUNC.selectOrInsert(query.query) !== 'SELECT') {
        sendError(res, RESCODE.badReq, TEXT.invQuery);
        return;
    }

    db.all(query.query, [], (err, rows) => {
        if (err) {
            sendError(res, RESCODE.intErr, TEXT.dbErr);
            return;
        }
        sendJSON(res, RESCODE.success, rows);
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

    db.run(body.query, [], function(err) {
        if (err) {
            sendError(res, RESCODE.intErr, TEXT.dbErr);
            return;
        }
        sendJSON(res, RESCODE.created, { 
            message: TEXT.created, 
            result: { 
                insertId: this.lastID,
                affectedRows: this.changes 
            }
        });
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
        db.close(() => {
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
