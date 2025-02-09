const http = require('http');
const url = require('url');
const fs = require('fs');
const utils = require('./modules/utils');
const TEXT = require('./locals/en/en').TEXT;

const PATHS = {
    GET_DATE: 'getDate/',
    WRITE_FILE: 'writeFile/',
    READ_FILE: 'readFile/'
};
const FILE = 'file.txt';

http.createServer((req, res) => {
    let q = url.parse(req.url, true);
    let result = '';
    let resCode = 200;

    if (q.pathname === PATHS.GET_DATE) {
        result = utils.getDate(q.query.name);
    } else if (q.pathname === PATHS.WRITE_FILE) {
        try {
            fs.appendFileSync(FILE, q.query.text);
            result = `<h1>${TEXT.saved}</h1>`;
        } catch (error) {
            resCode = 500;
            result = `<h1>${resCode} ${TEXT.err500}</h1>`;
        }
    } else if (q.pathname.includes(PATHS.READ_FILE)) {
        const filepath = q.pathname;
        const filename = filepath.replace(PATHS.READ_FILE, '');
        try {
            result = fs.readFileSync(filename);
        } catch (error) {
            resCode = 404;
            result = `<h1>${resCode} ${filename} ${TEXT.err404}</h1>`;
        }
    } else {
        resCode = 404;
        result = `<h1>${resCode} ${TEXT.err404}</h1>`;
    }

    res.writeHead(resCode, { 'Content-Type': 'text/html'});
    res.write(result);
    res.end();
}).listen(8080, () => console.log('Server is running on port 8080'));
