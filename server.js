require('dotenv').config();
const http = require('http');
const app = require('./index')

const server = http.createServer();
server.listen(process.env.PORT)
server.on('listening', () => {
    console.log(`Listening on port ${process.env.PORT}`);
})

