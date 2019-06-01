const http = require('http');
const port = 3000;

const server = http.createServer((req, res) => {
    res.setHeader("Content-Type", "plain text");
    res.end('Hello World');
});

server.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }
    console.log(`server is listening on ${port}`)
});