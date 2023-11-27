const Chat = function(socket){
    this.socket = socket
}

Chat.prototype.sendMessage = function(room , text){
    const message = {
        text : text ,
        room : room
    }
    this.socket.emit('message', message)
}

Chat.prototype.changeRoom = function(room){
    this.socket.emit('join', {
        newRoom : room
    })
}

Chat.prototype.proccesCommand = function(command){
    const words = command.split(' ')
    const command = words[0].substring(1 , words[0].length).toLowerCase();
    let message = false 
    switch(command){
        case "join":
            words.shift();
            const room = words.join(' ')
            this.changeRoom(room)
            break
        case 'nick':
            words.shift();
            const name = words.join(" ");
            this.socket.emit("namesAttempt", name );
            break;
        default :
           message = ' Unrecognized command'
           break
    }
    return message 
};






