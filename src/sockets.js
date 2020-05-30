const Chat = require('./models/chat');
const User = require('./models/users');

module.exports = function (io) {
  let socketsUsers = {};

  io.on('connection', async (socket) => {
    let messages = await Chat.find({}).limit(8);
    socket.emit('load old msgs', messages);

    socket.on('new user', async (data) => {
      if (data.email in socketsUsers) {
        socket.emit('usernames');
      } else {
        socket.email = data.email;
        socketsUsers[socket.email] = socket;

        var newUser = new User({
          nickname: data.nickname,
          email: data.email,
          password: data.password,
          userType: data.userType,
        });
        await newUser.save();

        let users = await User.find({}).limit(10);
        io.sockets.emit('usernames', users);
      }
    });

    socket.on('send message', async (data) => {
      var newMsg = new Chat(data);
      await newMsg.save();

      io.sockets.emit('new message', data);
    });

    socket.on('disconnect', async (data) => {
      if (!socket.email) return;
      var myquery = { email: socket.email };
      await User.deleteOne(myquery);
      delete socketsUsers[socket.email];
      let users = await User.find({}).limit(10);
      io.sockets.emit('usernames', users);
    });
  });
};
