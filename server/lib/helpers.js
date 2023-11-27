const assignGuestName = (socket , guestNumber , namesUsed , nickNames) =>{
    const name = `Guest${guestNumber}`
    nickNames[socket.id] = name ;
    socket.emit('nameResult', {
        name : name,
        succes : true 
    });
    namesUsed.push(name);
    return guestNumber + 1 
}

const joinRoom = (socket , room ,  currentRoom , nickNames) =>{
    socket.join(room);
    currentRoom[socket.id] = room;
    socket.emit('joinResult', { room: room });
    socket.broadcast.to(room).emit('message', {
        text: `${nickNames[socket.id]} has joined room.`
    });

    const usersInroom = io.in(room).sockets;
    
    if(usersInroom.length > 1 ){
        let userInRoomSummary = ` Users in ${room} : `
        for(let index in usersInroom){
            const userSocketId = usersInroom[index].id 
            let conditionSummary = userSocketId != socket.id && index > 0 ;
            if(conditionSummary) {
                userInRoomSummary +=', ';
            }

            userInRoomSummary += nickNames[userSocketId]
        };
        userInRoomSummary += '.';
        socket.emit('message' , {text : userInRoomSummary});
    }
}

const handleNameChangeAttempts = (socket , namesUsed , nickNames , currentRoom) => {
    socket.on('nameAttempt', function(name){
        if(name.indexOf("Guest") === 0){
            socket.emit('nameResult', {
                succes : false,
                message : `Names cannot begin with guest`
            })
        } else {
            if(namesUsed.indexOf(name) == -1 ){
                const previousName = nickNames[socket.id]
                const previousNameIndex = namesUsed.indexOf[previousName]
                namesUsed.push(name)
                nickNames[socket.id] = name;
                delete namesUsed[previousNameIndex]
                socket.emit('namesResult', {
                    succes : true ,
                    name : name 
                })
                socket.broadcast.to(currentRoom[socket.id]).emit('message', {
                    text : `${previousName} is now known as ${name}`
                })
            } else {
                socket.emit('namesResult', {
                    succes : false ,
                    message : `Name is already in use `
                })
            }
        }
    })
}


const handleMessageBroadcasting = (socket , nickNames) =>{
      socket.on('message' ,(message) =>{
        socket.broadcast.to(message.room).emit('message', {
            text : `${nickNames[socket.id]} : ${message.text}`
        })
      })
}

const handleRoomJoining = (socket, currentRoom) => {
    socket.on('join', (room) => {
        socket.leave(currentRoom[socket.id]);
        socket.join(room.newRoom);
    });
};

const handleClientDisconnect = (socket , namesUsed , nickNames )=>{
    socket.on('disconnect', ()=>{
        const nameIndex = namesUsed.indexOf(nickNames[socket.id]);
        delete namesUsed[nameIndex];
        delete nickNames[socket.id]
    })
}


module.exports = {
    assignGuestName,
    joinRoom,
    handleNameChangeAttempts,
    handleMessageBroadcasting,
    handleRoomJoining,
    handleClientDisconnect
}