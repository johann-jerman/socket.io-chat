import express from 'express';
import http from "http";
import cors from "cors";
import { ENV, PORT } from './config/env.js';
import { Server } from "socket.io";
import Users from './helpers/Users.js';
import { log } from 'console';

const app = express();
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
  
});
const user = new Users()

app.use(cors({
  origin: '*',
  
}))
app.use(express.urlencoded({ extended: false }));


io.on('connection', (socket)=>{
  socket.on("join", (room) => {
    console.log(room);
    socket.join(room.code.trim());
    if (user.getUser(socket.id)) {
      user.removeUser(socket.id);
    } 
    user.setUser(socket.id, room.code, room.turn);
    socket.emit("join", {
      room: room.code,
      turn: room.turn,
      id: socket.id
    })
    let newMessage = {
      from:  "Admin",
      body: "Alguien se unio a la Sala!!"
    }
    io.to(room.code).emit('message', newMessage)
  })

  socket.on("teteti", (tablero)=>{

  })
  
  socket.on("message", (message) => {
    let userSocket = user.getUser(socket.id)
    let newMessage = {
      from:  userSocket.id,
      body: message.body
    }
    
    io.to(userSocket.room).emit('message', newMessage)
  })

  socket.on("game", (game)=>{
    if (game.turn != game.currentTurn) {
      //aca enviamos el error si no fue correctamente enviado el turno actual con la ficha que fue movida
    }
    let {tateti, y, x, turn} = game
    tateti[y][x] = turn
    let userSocket = user.getUser(socket.id)
    if(userSocket) {
      //emitis el error de que no existe el socket
    }
    console.log(game);
    io.to(userSocket.room).emit('game', game)
  })

  socket.on("disconnect", () =>{

  })
})

server.listen(PORT, () => {
  if (ENV == "DEV") {
    console.log(`server running at http://localhost:${PORT}`);
  }
});