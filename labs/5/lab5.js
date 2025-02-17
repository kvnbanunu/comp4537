const http = require('http');
const url = require('url');
const db = require('./modules/database');
const TEXT = require('./modules/text').messages;
const PORT = 8082;

const PATHS = {
    base: "/sql"
}

const CONTENT = {
    json: "application/json",
    html: "text/html",
    text: "text/plain"
}

const RESCODE = {
    success: 200,
    badReq: 400,
    notFound: 404
}

http.createServer((req, res) => {
    if (req.method === "OPTIONS") {
        res.writeHead(204, {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
        });
        res.end();
        return;
    }
    const q = url.parse(req.url, true);
    let resCode = RESCODE.success;
    let contype = CONTENT.json;
    let result = "";
    
    if (q.pathname === PATHS.base) {
        if (req.method === "GET" || req.method === "POST") {
            let data = '';
            req.on('data', chunk => {
                data += chunk;
            });
            
            req.on('end', async () => {
                try {
                    const reqData = JSON.parse(data);
                    let response;

                    if (req.method === "POST" && reqData.type === 'predefined') { // Handle the repeat query
                        try {
                            response = await db.insertPredefinedPatients();
                        } catch (error) {
                            response = { error: error.message };
                            resCode = RESCODE.badReq;
                        }
                    } else if (reqData.query) { // Handle custom query
                        try {
                            response = await db.executeQuery(reqData.query);
                        } catch (error) {
                            response = { error: error.message };
                            resCode = RESCODE.badReq;
                        }
                    } else {
                        response = { error: TEXT.invReq };
                        resCode = RESCODE.badReq;
                    }

                    res.writeHead(resCode, {
                        "Content-Type": contype,
                        "Access-Control-Allow-Origin": "*"
                    });
                    res.end(JSON.stringify(response));
                } catch (e) {
                    resCode = RESCODE.badReq;
                    res.writeHead(resCode, {
                        "Content-Type": contype,
                        "Access-Control-Allow-Origin": "*"
                    });
                    res.end(JSON.stringify({ error: TEXT.invReq }));
                }
            });
            return;
        } else {
            resCode = RESCODE.badReq;
            contype = CONTENT.html;
            result = `<h1>${TEXT.badReq}</h1>`;
        }
    } else {
        resCode = RESCODE.notFound;
        contype = CONTENT.html;
        result = `<h1>${TEXT.notFound}</h1>`;
    }

    res.writeHead(resCode, {
        "Content-Type": contype,
        "Access-Control-Allow-Origin": "*"
    });
    res.write(result);
    res.end();
}).listen(PORT);
