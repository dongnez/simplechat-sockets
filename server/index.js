import express from 'express';
import path, { join } from 'path';
import { fileURLToPath } from 'url';
import { Server }  from 'socket.io'; //* Sockets
import http  from 'http';
import cors  from 'cors';

const PORT = process.env.PORT || 3001;
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express();

app.use(cors());
app.use(express.static(join(__dirname,'../client/build')));

app.get("/",function(_,res){
  res.sendFile(
    path.join(__dirname,"../client/build/index.html"),
    function (err){
      if(err){
        //res.status(500).send(err);
      }
    }
  )
})

app.get('/api/test',(req,res)=>{
  res.send("Test Work")
})

const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    //origin: 'https://simplechat-sockets-dongnez.vercel.app/'+PORT, 
    //transports: ['websocket', 'polling'],
    //credentials: true,
    //methods: ['GET', 'POST',],
  },
  //allowEIO3: true,
  //allowUpgrades:true
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




