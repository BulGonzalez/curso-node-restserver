require('dotenv').config();

//Se hace el require a mi archivo de clase
const Server = require('./models/server');


const server = new Server();

server.listen();


