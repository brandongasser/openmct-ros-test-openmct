const express = require('express');

const app = express();
const port = process.env.PORT || 8080;

function Server() {
    var router = express.Router();

    router.use('/', express.static(__dirname + '/..'));

    return router;
}

const server = new Server();

app.use(server);

app.listen(port);
console.log('Server started at http://localhost:' + port);