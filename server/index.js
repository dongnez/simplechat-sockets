import express from 'express';
import path, { join } from 'path';
import { fileURLToPath } from 'url';
import { Server }  from 'socket.io'; //* Sockets
import http  from 'http';
import cors  from 'cors';

const PORT = process.env.PORT || 3001;
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express();

const server = http.createServer(app);

app.use(cors());

app.use(express.static(join(__dirname,'../client/build')));

const io = new Server(server, {
  cors: {
    //origin: 'http://localhost:3000', 
    // methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('An user has connected', socket.id);

  socket.on('join_room',(data)=>{
    socket.join(data.name);
  });

  socket.on('leave_room',(data)=>{
    if(data)
      socket.leave(data.name)
  })


  socket.on('message', (data) => {
    console.log('Message',data);
    socket.broadcast.to(data.room).emit('message', data);
  });
}); 

server.listen(PORT, () => {
  console.log('Server running: ' + `http://localhost:${PORT}` );
});

app.get("*",function(_,res){
  res.sendFile(
    path.join(__dirname,"../client/build/index.html"),
    function (err){
      if(err)
        res.status(500).send(err);
    }
  )
})
