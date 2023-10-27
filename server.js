import express from "express";
import { config } from "dotenv";
const app = express()
import { Server } from "socket.io";
import {createServer} from 'http'



config({
    path: './config.env'
})

const port = process.env.PORT;
console.log(port)

app.get('/', (req, res)=>{
    res.send("Server is working")
})

const users = [{}]
const server = createServer(app)
const io = new Server(server, {
    cors:{
        origin: '*'
    }
})

io.on("connection", (socket)=>{
    console.log("a user is connected")

    socket.on('joined', ({user}, callback)=>{
        users[socket.id]= user
        console.log(`${user} has joined` )
        callback(socket.id);
        socket.broadcast.emit('userJoined', {
            user: "Admin:",
            message: `${users[socket.id]}, joined the chat`
        })
    })
    socket.on('chat', (payload)=>{
        console.log(payload)
        io.emit("chat", payload)
    })

    socket.on('disconnect', ()=>{
        socket.broadcast.emit('leave', {
            user: "Admin:",
            message: `${users[socket.id]}, left the chat`
        })
    })
})


server.listen(port, ()=>{
    console.log("server is live ")
})