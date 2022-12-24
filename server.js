const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
//Sockets
const { Server } = require('socket.io');
const http = require('http');
const server = http.createServer(app);
const cors = require('cors');
//httpServer.listen(3000);
const PORT = 3001;

app.use(cors());

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
  // options/
});

io.on('connection', (socket) => {
  console.log('Un usuario se ha conectado', socket.id);
  

  socket.on('message', (data) => {
    console.log('Mensaje',data);
    
    socket.broadcast.emit('message', data);
  });
}); 

server.listen(PORT, () => {
  console.log('Corriendo en Puerto: ' + PORT);
});

//app.use(express.static('static'));

/* app.get('/', (req, res) => {
  
  res.sendFile(path.resolve('public/index.html'));
}); */

/* app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
}); */
