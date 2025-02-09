const http = require('http');
const url = require('url');
const dictionary = require('./modules/dictionary').dictionary;

const PORT = 8081;

const PATHS = {
    base:'/definitions',
    clear:'/clear'
};

const CONTENT = {
    json: "application/json",
    html: "text/html",
    text: "text/plain"
};

let reqno = 0;

http.createServer((req, res) => {
    let q = url.parse(req.url, true);
    let result = '';
    let resCode = 200;
    let contype = CONTENT.json;
    reqno++;

    if (q.pathname === PATHS.base) {
        if (req.method === "GET") {
            result = dictionary.search(q.query.word);
        } else if (req.method === "POST") {
            if (req.headers["access-control-request-method"]) {
                res.setHeader("Access-Control-Allow-Origin", "*");
                res.setHeader("Access-Control-Allow-Methods", "POST");
                res.end();
            } else {
                let query = "";
                req.on("data", function(chunk) {
                    query += chunk;
                });
                req.on("end", function() {
                    const params = JSON.parse(query);
                    const word = params.word;
                    const def = params.definition;
                    contype = CONTENT.text;
                    result = dictionary.add(word, def, reqno);
                });
            }
        } else {
            resCode = 400;
            contype = CONTENT.html;
            result = `<h1>${resCode} Bad Request</h1>`;
        }
    } else if (q.pathname === PATHS.clear) {
        dictionary.clear();
        reqno = 0;
        contype = CONTENT.html;
        result = `<h1>Cleared the dictionary and request count.</h1>`;
    } else {
        resCode = 404;
        contype = CONTENT.html;
        result = `<h1>${resCode} Not Found</h1>`;
    }

    res.writeHead(resCode, {
        'Content-Type': contype,
        'Access-Control-Allow-Origin': '*'
    });
    res.write(result);
    res.end();
}).listen(PORT);
