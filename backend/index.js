const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

// app.get('/', (req, res) => {
//     res.send('<h1>Hello world</h1>');
// });

const io = require('socket.io')(server, {
    cors:{
        origin:"http://localhost:8080",
        methods: ["GET", "POST"]
    }
})

io.on('connection', (socket)=>{
    socket.emit("hello", "world");
    socket.on("play", (index, gameid) =>{
        console.log("server received", index)
        socket.broadcast.to(gameid).emit("play", index)
    })
    socket.on("reset", (gameid, isover, winner, istie, content) => {
        socket.broadcast.to(gameid).emit("reset", gameid, isover, winner, istie, content)
    })
    socket.on("gameid", gameid => {
        console.log(gameid)
        socket.join(gameid)
    })
    socket.on("disconnect", () => {
        console.log("User Disconnected");
      });
})

server.listen(3000, () => {
    console.log('listening on *:3000');
});