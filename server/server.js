const express = require('express');
const app = express();
const path = require('path');
const PORT = 3001;
//Sockets
const { Server } = require('socket.io');
const http = require('http');
const server = http.createServer(app);
const cors = require('cors');

app.use(cors());

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
  // options/
});

io.on('connection', (socket) => {
  console.log('An user has connected', socket.id);
  
  socket.on('join_room',(data)=>{
    //console.log('Data:',data);
    
    socket.join(data.name);
  });

  socket.on('message', (data) => {
    console.log('Message',data);
    
    socket.broadcast.to(data.room).emit('message', data);
  });
}); 

server.listen(PORT, () => {
  console.log('Server running: ' + PORT);
});

//app.use(express.static('static'));

/* app.get('/', (req, res) => {
  
  res.sendFile(path.resolve('public/index.html'));
}); */

/* app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
}); */
