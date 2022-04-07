const { checkPrime } = require('crypto');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { v4: uuidv4 } = require('uuid');

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
    socket.emit("hello", "world");
    socket.emit("socket", socket.id)
    socket.on("play", (index, gameid) => {
        socket.broadcast.to(gameid).emit("play", index)
    })
    socket.on("reset", (gameid, isover, winner, istie, content) => {
        socket.broadcast.to(gameid).emit("reset", gameid, isover, winner, istie, content)
    })
    socket.on("gameid", gameid => {
        var data = new Object();
        data.gameid = gameid
        data.socketid = socket.id
        array.push(data)

        var valueArr = array.map(function (item) { return item.gameid });
        const counts = {};
        valueArr.forEach(function (x) { counts[x] = (counts[x] || 0) + 1; });
        for (const [key, value] of Object.entries(counts)) {
            //console.log(`${key}: ${value}`);
            if (key == gameid.toString() && value <= 2) {
                socket.join(gameid)
            }
            else if (value > 2) {
                //array.splice(objindex, 1);
                array.pop()
                console.log("Too many players")
            }
        }
        socket.broadcast.to(gameid).emit("socket", socket.id)
    })
    // socket.on("check", (check, gameid) => {
    //     console.log(check)
    //     socket.broadcast.to(gameid).emit("check", check);
    // })
    socket.on("socketid", (played, gameid) => {
        socket.broadcast.to(gameid).emit("socketid", played);
    })
    socket.on("disconnect", () => {
        const objindex = array.findIndex(object => {
            return object.socketid == socket.id;
        });
        array.splice(objindex, 1);
    });

    socket.on("data", (content, winner, istie, gameid, isover) => {
        socket.broadcast.to(gameid).emit("data", content, winner, istie, uuidv4(), isover)
    })
})

server.listen(3000, () => {
    console.log('listening on *:3000');
});