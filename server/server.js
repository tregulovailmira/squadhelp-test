require('./dbMongo/mongoose');
const http = require('http');
const app = require('./app');
const controller = require('./socketInit');

const PORT = process.env.PORT || 9632;


const server = http.createServer(app);

controller.createConnection(server);

server.listen(PORT,
  () => console.log(`Example app listening on port ${ PORT }!`));


