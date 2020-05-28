const http = require('http');
const path = require('path');

const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio.listen(server);

//settings
app.set('port', process.env.PORT || 8080);

require('./sockets')(io);

//star files
app.use(express.static(path.join(__dirname,'public')));


//start server 
server.listen(8080, () => {
    console.log('server on port', app.get('port'));
});