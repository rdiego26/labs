var express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

server.listen(8080);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/view/index.html');
});


var usernames = {};

io.sockets.on('connection', function (socket) {

  socket.on('sendchat', function (data) {
    io.sockets.emit('updatechat', socket.username, data);
  });


  socket.on('adduser', function(username){
    socket.username = username;
    usernames[username] = username;
    socket.emit('updatechat', 'SERVER', 'Você entrou na sala!');
    socket.broadcast.emit('updatechat', 'SERVER', username + ' entrou na sala');
    io.sockets.emit('updateusers', usernames);
  });

  socket.on('disconnect', function(){
    delete usernames[socket.username];
    io.sockets.emit('updateusers', usernames);
    socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' Saiu da sala!');
  });
});