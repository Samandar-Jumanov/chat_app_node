const assignGuestName = (socket , guestNumber , namesUsed , nickNames) =>{
    const name = `Guest${guestNumber}`
    nickNames[socket.id] = name ;
    socket.emit('nameResult', {
        name : name ,
        succes : true 
    });
    namesUsed.push(name);
    return guestNumber + 1 
}

const joinRoom = (socket , room ,  currentRoom , nickNames) =>{
    socket.join(room);
    currentRoom[socket.id] = room; 
    socket.emit('joinResult', {room : room });
    socket.broadcast.to(room).emit('message', {
         text : `$${nickNames[socket.id]} has joined room.`
    })
    const usersInroom = io.sockets.room(room);
    if(usersInroom.length > 1 ){
        let userInRoomSummary = ` Users in ${room} : `
        for(let index in usersInroom){
            const userSocketId = usersInroom[index].id 
            let conditionSummary = userSocketId != socket.id && index > 0 ;
            if(conditionSummary) {
                userInRoomSummary +=', '
            }

            userInRoomSummary += nickNames[userSocketId]
        }
        userInRoomSummary += '.'
        socket.emit('message' , {text : userInRoomSummary})
    }
}

module.exports = {
    assignGuestName,
    joinRoom
}