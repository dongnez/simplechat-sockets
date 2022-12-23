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

app.use(cors());

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
  // options/
});

io.on('connection', (socket) => {
  console.log('Un usuario se ha conectado', socket.id);

  socket.on('send_message', (data) => {
    console.log(data);
    //io.emit('receive_message', data);
    socket.broadcast.emit('receive_message', data);
  });
});

server.listen(3001, () => {
  console.log('Corriendo');
});

//app.use(express.static('static'));

/* app.get('/', (req, res) => {
  
  res.sendFile(path.resolve('public/index.html'));
}); */

/* app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
}); */
