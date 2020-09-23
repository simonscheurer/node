const sv = require('./server');
const db = require('./model');
const fs = require('fs');

const state = {
    server: new sv.Server(1337, "localhost"),
    database: new db.Database()
};

function initServer() {
    const server = state.server;

    addHandlers();
    server.start();

    function addHandlers() {
        server.addHandler(
            url => url.pathname === ('/'), 
            (url, req, resp) => handleStatic(resp, '/index.html'));
        server.addHandler(
            url => url.pathname.startsWith('/api'), 
            (url, req, resp) => handleApi(resp, url));
        server.addHandler(
            url => true, 
            (url, req, resp) => handleStatic(resp, url.pathname));
    }

    function handleStatic(response, resource) {
        function send(path, type, response, isText = true) {
            try {
                const data = fs.readFileSync(path, isText ? 'utf-8' : null);
                if (data) {
                    response.writeHeader(200, { 'Content-Type': 
                    `${isText ? "text" : "image"}/${type}`}); 
                    response.end(data);
                }
            }
            catch (error) {
                console.log(`Not able to read resource ${resource}`);
            }
        }

        const path = `${__dirname}/res${resource}`;
        const extension = resource.split('.').pop();
        switch (extension) {
            case "html":
                send(path, "html", response);
                break;
            case "js":
                send(path, "js", response);
                break;
            case "css":
                send(path, "css", response);
                break;
            case "jpg":
                send(path, 'jpeg', response, false);
                break;
            case "png":
                send(path, 'png', response, false);
                break;
        }
    }
    
    function handleApi(response, url) {
        response.writeHeader(200, { 'Content-Type': 'text/json'});
        if (url.pathname.startsWith('/api/products')) {
            handleProducts(response);
        }
        else if (url.pathname.startsWith('/api/detail')) {
            const id = url.query.id;
            if (id) {
                handleDetail(id, response);
            }
        }
    }

    function handleProducts(response) {
        let items = state.database.getList();
        response.end(JSON.stringify(items));
    }
    
    function handleDetail(id, response) {
        let item = state.database.getEntry(id);
        if (item) {
            response.end(JSON.stringify(item));
        }
    }
}

initServer();


