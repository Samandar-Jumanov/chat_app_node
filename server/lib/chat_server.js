const socket = require('socket.io')
const helperFunctions = require('./helpers.js')
let io;
let guestNumber = 1 ;
const nickNames = {};
const namesUsed = {};
const  currentRoom = {};


exports.listen= function (server) {
    io = socket(server , {
        log : 1 
    })

    io.on('connection', function(socket){
        guestNumber = helperFunctions.assignGuestName(socket , guestNumber , nickNames , namesUsed);
        helperFunctions.joinRoom(socket , `Lobby` , currentRoom , nickNames)
        helperFunctions.handleMessageBroadcasting(socket , nickNames);
        helperFunctions.handleNameChangeAttempts(socket , nickNames , namesUsed , currentRoom);
        helperFunctions.handleRoomJoining(socket , namesUsed , nickNames);
        socket.on('rooms', () => {
            socket.emit('rooms', io.sockets.adapter.rooms);
        });
        helperFunctions.handleClientDisconnect(socket , nickNames , namesUsed);
    });

}

