const divEscapedContentElement = (message) => {
    return $('<div></div>').text(message);
}

const divSystemContentElement = (message) => {
    return $('<div></div>').html(`<i>${message}</i>`);
}

const processUserInput = (chatApp, socket) => {
    const message = $('#send-message').val(); // Use a different variable name to avoid conflicts
    let systemMessage;

    if (message.charAt(0) === '/') {
        systemMessage = chatApp.processCommand(message);
        if (systemMessage) {
            $('#messages').append(divEscapedContentElement(systemMessage));
        }
    } else {
        chatApp.sendMessage($('#room').text(), message); // Add parentheses to call the function
        $('#messages').append(divEscapedContentElement(message));
        $('#messages').scrollTop($('#messages').prop('scrollHeight'));
    }

    $('#send-message').val('');
}

const socket = io.connect();
$(document).ready(function(){
    const chatApp = new Chat(socket);
    socket.on('namesREsult', (result)=>{
        let message;
        if(result.succes){
            message = `You are now known as ${result.name}`
        } else {
             message = result.message
        }
    })
    $(`#messages`).append(divSystemContentElement(message))

    socket.on('joinResult', (result)=>{
        $(`#room`).text(result.room)
        $(`#messages`).append(divSystemContentElement("Room changed"))
    });

    socket.on('message', (result)=>{
        const newElement = $(`<div></div>`).text(message.text)
        $(`#messages`).append(newElement)
    });

    socket.on('rooms', (rooms)=>{
        for(let room in rooms ){
            room = room.substring(1 , room.length);
            if(room !== ""){
                $('#room-list').append(divEscapedContentElement(room))
            }
        }
        $(`#room-list div`).click(function(){
            chatApp.proccesCommand(`/join${this.text()}`);
            $(`#send-message`).focus();
        })
    })

    setInterval(()=>{
        socket.emit('rooms')
    } , 1000);

    $('#send-message').submit(()=>{
        processUserInput(chatApp , socket)
        return false
    })
})