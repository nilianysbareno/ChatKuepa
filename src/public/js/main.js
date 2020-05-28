$(function (){
    
    const socket = io();

    //obtaining DOM elements from the interfece
    const $messageFrom = $('#message-form');
    const $messageBox = $('#message');
    const $chat = $('#chat');

    //events
    $messageFrom.submit( e => {
        e.preventDefault ();
        socket.emit('send message', $messageBox.val());
        $messageBox.val('');
    });

    socket.on('new message', function (data){
        $chat.append(data + '<br/>'); 
    });
})