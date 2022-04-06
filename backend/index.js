const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
// const { Server } = require("socket.io");
// const io = new Server(server);

// app.get('/', (req, res) => {
//     res.send('<h1>Hello world</h1>');
// });

// io.on('connection', (socket) => {
//     console.log('a user connected');
// });

const io = require('socket.io')(server, {
    cors:{
        origin:"http://localhost:8080",
        methods: ["GET", "POST"]
    }
})

io.on('connection', (socket)=>{
    socket.emit("hello", "world");
    socket.on("play", index=>{
        console.log("server received", index)
        socket.broadcast.emit("play", index)
    })
    // socket.on("reset", index=>{
    //     console.log("server received", index)
    //     socket.broadcast.emit("play", index)
    // })


    // socket.on("isover", isover=>{
    //     console.log("server received", isover)
    //     socket.broadcast.emit("isover", isover)
    // })
    // socket.on("winner", winner=>{
    //     console.log("server received", winner)
    //     socket.broadcast.emit("winner", winner)
    // })
    // socket.on("istie", istie=>{
    //     console.log("server received", istie)
    //     socket.broadcast.emit("istie", istie)
    // })
    // socket.on("content", content=>{
    //     console.log("server received", content)
    //     socket.broadcast.emit("content", content)
    // })
    socket.on("reset", (isover, winner, istie, content) => {
        // socket.broadcast.emit("reset", isover)
        // socket.broadcast.emit("reset", winner)
        // socket.broadcast.emit("reset", istie)
        // socket.broadcast.emit("reset", content)
        socket.broadcast.emit("reset", isover, winner, istie, content)
    })
})

server.listen(3000, () => {
    console.log('listening on *:3000');
});