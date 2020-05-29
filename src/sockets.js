const Chat = require('./models/Chat');

module.exports = function (io){

    let users={};

    io.on('connection', async socket => {
        console.log('new user connected');

        let messages = await Chat.find({});
        socket.emit ('load old msgs',messages);

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

        socket.on('send message', async data => {
            var msg = data.trim();

            var newMsg = new Chat({
                msg,
                nick: socket.nickname
              });
              await newMsg.save();

            io.sockets.emit('new message', {
                msg:data,
                nick: socket.nickname
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