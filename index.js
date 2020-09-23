const fs = require('fs');
const sv = require('./server');

const json = fs.readFileSync(`${__dirname}/data.json`, 'utf-8');
const laptopData = JSON.parse(json);

const server = new sv.Server(1337, "localhost");
server.addHandler(
    url => url.pathname.startsWith('/product'), 
    (req, resp) => {
        resp.writeHeader(200, { 'Content-Type': 'text/html'});
        resp.end('This is the response');
    });
server.start();
