const Chat = require('./models/Chat');

module.exports = function (io){

    let users={};

    io.on('connection', socket => {
        console.log('new user connected');

        socket.on('new user', (data, cb) => {
            console.log(data);
            if(data in users){
                cb(false);
            } else {
                cb(true);
                socket.nickname = data;
                users[socket.nickname] = socket;
                updateNicknames();
            }
        });

        socket.on('send message', data => {
            
            io.sockets.emit('new message', {
                msg:data,
                nick:socket.nickname
            }); 
        });

        socket.on('disconnect', data => {
            if(!socket.nickname) return;
            delete users[socket.nickname];
            updateNicknames();
        });

        function updateNicknames(){
            io.sockets.emit('usernames', Object.keys(users));
        }
    
    });
    
}