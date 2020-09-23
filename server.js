const http = require('http');
const url = require('url');

class Server {
    constructor(port, host) {
        this.port = port;
        this.host = host;
        this.handlers = [];
    }

    stop() {
        if (this.server && this.server.listening) {
            this.server.stop();
        }
    }

    start() {
        this.stop();

        this.server = http.createServer((request, response) => {
            const requestUrl = url.parse(request.url, true);
            console.log(`Request for ${requestUrl.href}.`);

            for (const handler of this.handlers) {
                if (handler.match(requestUrl)) {
                    handler.handle(requestUrl, request, response);
                    break;
                }
            }
            this.sendNotFoundIfNotHandled(response, requestUrl.path);
        });
        
        this.server.listen(this.port, this.host, 
            () => console.log(`Server listening on http://${this.host}:${this.port}`));
    }

    sendNotFoundIfNotHandled(response, path) {
        if (!response.writableEnded) {
            console.log(`Error handling ${path}`);
            response.writeHeader(404, { 'Content-Type': 'text/html'});
            response.end();
        }
    }

    // match gets url object, handle gets request and response
    addHandler(match, handle) {
        this.handlers.push({
            match,
            handle
        });
    }
}

module.exports = {
    Server: Server
};