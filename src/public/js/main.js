$(function () {
  const socket = io();

  //obtaining DOM elements from the interfece
  const $messageFrom = $('#message-form');
  const $messageBox = $('#message');
  const $chat = $('#chat');

  //obtaining DOM elements from the login
  const $form = $('#form');
  const $nickname = $('#nickname');
  const $email = $('#email');
  const $password = $('#password');
  const $userType = $('#userType');

  const $emailError = $('emailError');

  const $users = $('#usernames');

  let userLogged = {};

  //events
  $form.submit((e) => {
    e.preventDefault();

    userLogged = {
      nickname: $nickname.val(),
      email: $email.val(),
      password: $password.val(),
      userType: $userType.val(),
    };

    socket.emit('new user', userLogged);
  });

  $messageFrom.submit((e) => {
    e.preventDefault();

    let msg = {
      text: $messageBox.val(),
      nickname: userLogged.nickname,
      userType: userLogged.userType,
    };

    socket.emit('send message', msg);
    $messageBox.val('');
  });

  socket.on('new message', (data) => {
    displayMsg(data);
  });

  socket.on('usernames', (data) => {
    if (data) {
      $('#nickWrap').hide();
      $('#contentWrap').show();
      $nickname.val('');
      let html = '';
      for (let i = 0; i < data.length; i++) {
        if (data[i].userType === 'Moderador') {
          html += `<p class="moderator"><i class="far fa-user"></i> ${data[i].nickname}</p>`;
        } else {
          html += `<p><i class="far fa-user"></i> ${data[i].nickname}</p>`;
        }
      }
      $users.html(html);
    } else {
      $emailError.html(`
             <div class="alert alert-danger">
             Ese correo ya existe
             </div>
         `);
    }
  });

  socket.on('load old msgs', (data) => {
    for (let i = 0; i < data.length; i++) {
      displayMsg(data[i]);
    }
  });

  function displayMsg(data) {
    if (data.userType === 'Moderador') {
      $chat.append(`<p class="msg moderator"><b>${data.nickname}</b>: ${data.text}</p>`);
    } else {
      $chat.append(`<p class="msg"><b>${data.nickname}</b>: ${data.text}</p>`);
    }
  }
});
