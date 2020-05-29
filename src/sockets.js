const Chat = require('./models/Chat');
const User = require('./models/users');

module.exports = function (io){

    io.on('connection', async socket => {
        console.log('new user connected');

        let messages = await Chat.find({}).limit(8);
        socket.emit ('load old msgs',messages);



        socket.on('new user', async (data,cb) => {
            
            var newUser = new User ({
                nickname: data.nickname,
                email: data.email,
                password: data.password,
                userType: data.userType
            });
            await newUser.save();

            let users = await User.find({}).limit(10);
            io.sockets.emit('usernames', users);
            
        })
        


        socket.on('send message', async data => {
            
            var newMsg = new Chat(data);
              await newMsg.save();

            io.sockets.emit('new message', data); 
        });

        socket.on('disconnect', data => {
            if(!socket.nickname) return;
            delete users[socket.nickname];
            updateNicknames();
        });

        function updateNicknames(){
            
            io.sockets.emit('usernames', users);
        }
    
    });
    
}