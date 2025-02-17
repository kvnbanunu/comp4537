const http = require('http');
const url = require('url');
const TEXT = require('./modules/text').messages;
const mysql = require('mysql');
const db = mysql.createConnection({
    host: 'localhost',
    user: process.env.USER,
    password: process.env.PASS,
    database: process.env.DATABASE
});

const PORT = 8082;

const PATHS = {
    base: "/base"
}

const CONTENT = {
    json: "application/json",
    html: "text/html",
    text: "text/plain"
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
    let resCode = 200;
    let contype = CONTENT.json;
    let result = "";
    
    if (q.pathname === PATHS.base) {
        if (req.method === "GET") {
            db.connect(function(err) {
                if (err) {

                } else {

                }
            });
        } else if (req.method === "POST") {

        } else {
            resCode = 400;
            contype = CONTENT.html;
            result = `<h1>${TEXT.badReq}</h1>`;
        }
    } else {
        resCode = 404;
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
