$(function (){
    
    const socket = io();

    //obtaining DOM elements from the interfece
    const $messageFrom = $('#message-form');
    const $messageBox = $('#message');
    const $chat = $('#chat');

    //obtaining DOM elements from the login
    const $nickForm = $('#nickForm');
    const $nickError = $('#nickError');
    const $nickname = $('#nickname');

    const $users = $('#usernames');

    $nickForm.submit(e => {
        e.preventDefault();
        socket.emit('new user', $nickname.val(), data => {
            if(data){
                $('#nickWrap').hide();
                $('#contentWrap').show();
            } else {
                $nickError.html(`
                 <div class="alert alert-danger">
                 Ese usuario ya existe 
                 </div>
             `);
            }
            $nickname.val('');
        });
    });

    //events
    $messageFrom.submit( e => {
        e.preventDefault ();
        socket.emit('send message', $messageBox.val());
        $messageBox.val('');
    });

    socket.on('new message', data =>{
        displayMsg(data);
    });

    socket.on ('usernames', data => { 
        let html = '';
        for (let i = 0; i < data.length; i++) {
            html += `<p><i class="far fa-user"></i> ${data[i]}</p>`
        }
        $users.html(html);
    });

    socket.on('load old msgs', data => {
        console.log(data);
        for (let i = 0; i < data.length; i++){
            displayMsg(data[i]);
        }
    });

    function displayMsg(data) {
        $chat.append(`<p class="msg"><b>${data.nick}</b>: ${data.msg}</p>`);
      }

    
})