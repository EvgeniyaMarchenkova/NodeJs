const http = require('http');
const fs = require('fs');
const path = require('path');
const port = 3001;

const indexPath = __dirname + '/' + 'index.html';

const server = http.createServer((req, res) => {
    res.setHeader("Content-Type", "html");
    const stream = fs.createReadStream(indexPath);
    stream.pipe(res);
}).listen(port);

// const data = fs.readFileSync('./index.html', 'utf8');
// http.createServer((request, response) => {
//     response.setHeader("Content-Type", "html");
//     response.end(data.replace(/message/g, 'I am replaced message'));
// }).listen(port);