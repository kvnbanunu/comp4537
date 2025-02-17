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

// This function is used to parse the array sent from client
function createInsertQuery(personData) {
    const values = personData.map(person => 
        `('${person.name}', '${person.date}')`
    ).join(', ');

    return `INSERT INTO patient (name, dateOfBirth) VALUES ${values}`;
}

function renderTable(results) {
    if (!results || results.length === 0) {
        return '<p>No results found</p>';
    }
    const headers = Object.keys(results[0]);
    let html = `
    <table>
        <thead>
            <tr>
                ${headers.map(header => `<th>${header}</th>`).join('')}
            </tr>
        </thead>
        <tbody>
    `;

    results.forEach(row => {
        html += '<tr>';
        headers.forEach(header => {
            html += `<td>${row[header]}</td>`;
        });
        html += '</tr>';
    });

    html += `
            </tbody>
        </table>
    `;
    return html;
}

http.createServer(async (req, res) => {
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
        if (req.method === "GET") {
            const sqlQuery = q.query.query;

            if (!sqlQuery) {
                resCode = RESCODE.badReq;
                res.writeHead(resCode, {
                    "Content-Type": contype,
                    "Access-Control-Allow-Origin": "*"
                });
                res.end(JSON.stringify({
                    error: TEXT.noQuery
                }));
                return;
            }

            try {
                const response = await db.executeQuery(sqlQuery);
                contype = CONTENT.html;
                res.writeHead(resCode, {
                    "Content-Type": contype,
                    "Access-Control-Allow-Origin": "*"
                });
                res.end(renderTable(response.results));
            } catch (error) {
                contype = CONTENT.html;
                res.writeHead(resCode, {
                    "Content-Type": contype,
                    "Access-Control-Allow-Origin": "*"
                });
                res.end(`<h1>Error: ${error.message}</h1>`);
            }
            return;
        } else if (req.method === "POST") {
            let data = '';
            req.on('data', chunk => {
                data += chunk;
            });
            
            req.on('end', async () => {
                try {
                    const reqData = JSON.parse(data);
                    let response;
                    let query;

                    if (req.method === "POST" && Array.isArray(reqData)) { // Handle the repeat query
                        query = createInsertQuery(reqData);
                    } else if (reqData.query){ // handle custom query
                        query = reqData.query;
                    } else {
                        response = { error: TEXT.invReq };
                        resCode = RESCODE.badReq;
                    }
                    
                    if (query) {
                        try {
                            response = await db.executeQuery(query);
                        } catch (error) {
                            response = { error: error.message };
                            resCode = RESCODE.badReq;
                        }
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
