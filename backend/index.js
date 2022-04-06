const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { v4: uuidv4 } = require('uuid');

let data = {}
let array = []
let counter = 0

// app.get('/', (req, res) => {
//     res.send('<h1>Hello world</h1>');
// });

const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:8080",
        methods: ["GET", "POST"]
    }
})

io.on('connection', (socket) => {
    //console.log(io.sockets.adapter.rooms)
    socket.emit("hello", "world");
    //console.log(socket.id)
    socket.on("play", (index, gameid) => {
        socket.broadcast.to(gameid).emit("play", index)
    })
    socket.on("reset", (gameid, isover, winner, istie, content) => {
        socket.broadcast.to(gameid).emit("reset", gameid, isover, winner, istie, content)
    })
    socket.on("gameid", gameid => {
        socket.join(gameid)
    })
    socket.on("disconnecting", () => {
        //console.log("User Disconnected");
        //console.log("socket room ",socket.rooms);
    });

    socket.on("data", (content, winner, istie, gameid, isover) => {
        socket.broadcast.to(gameid).emit("data", content, winner, istie, uuidv4(), isover)
    })
})

server.listen(3000, () => {
    console.log('listening on *:3000');
});