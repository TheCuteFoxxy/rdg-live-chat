
const express = require('express');
const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
const io = io(server);

const users = {}

io.on('connection', socket =>{
    socket.on('new-user', name =>{
        users[socket.id] = name       
         if(name == "null"){
            socket.broadcast.emit('null-user', name)
            delete users[socket.id]
        }else{
        socket.broadcast.emit('user-connected', name)
        }
    })
    socket.on('send-chat-message', message =>{
        socket.broadcast.emit('chat-message', {message: message, name: users[socket.id]})
    })
    socket.on('disconnect', () =>{
        socket.broadcast.emit('user-disconnected', users[socket.id])
        delete users[socket.id]
    })
})