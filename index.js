const fs = require('fs');
const sv = require('./server');

const json = fs.readFileSync(`${__dirname}/data.json`, 'utf-8');
const laptopData = JSON.parse(json);

const server = new sv.Server(1337, "localhost");

server.addHandler(
    url => url.pathname.startsWith('/products'), 
    (url, req, resp) => handleProducts(resp));
server.addHandler(
    url => url.pathname.startsWith('/laptop'), 
    (url, req, resp) => {
        const id = url.query.id;
        if (id) {
            handleLaptop(id, resp);
        }
    });

server.start();

function handleProducts(response) {
    response.writeHeader(200, { 'Content-Type': 'text/html'});
    response.end('This is the response for products');
}

function handleLaptop(id, response) {
    response.writeHeader(200, { 'Content-Type': 'text/html'});
    response.end('This is the response for laptop ' + id);
}
