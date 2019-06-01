const http = require('http');
const port = 3002;

const product = {
    id: 1,
    name: 'Supreme T-Shirt',
    brand: 'Supreme',
    price: 99,
    options: [
        {
            color: 'blue',
            size: 'XL'
        }
    ]
};

const server = http.createServer((req, res) => {
    res.setHeader("Content-Type", "JSON");
    res.end(JSON.stringify(product));
}).listen(port);