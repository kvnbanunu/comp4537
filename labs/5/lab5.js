const http = require('http');
const url = require('url');
const TEXT = require('./modules/text').messages;

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
