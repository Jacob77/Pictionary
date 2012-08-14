/****************
 *   server.js  *
 ****************/

(function() {
  var io;
  io = require('socket.io').listen(8080);
  var usernames = [];
  var index = 0;
  io.sockets.on('connection', function(socket) {
    socket.on('drawClick', function(data) {    //send draw to clients
      socket.broadcast.emit('draw', {
        x: data.x,
        y: data.y,
        hasErase: data.hasErase
      });
    });
    
    socket.on('drawMove', function(data) {     //send move position and color to clients
        socket.broadcast.emit('mousedown', {
          x: data.x,
          y: data.y,
          downColor: data.downColor,
          hasErase: data.hasErase
        });
      });
    
  //send what color changed (draw pencil) to clients
    socket.on('colorChange', function(data) {        
        socket.broadcast.emit('changeColor', {
          y: data.y,
        });
      });
    
    socket.on('thicknessChange', function(data) {    //send new line width
        socket.broadcast.emit('changeThickness', {
          y: data.y
        });
      });
    
    socket.on('upmouse', function(data) {        //restore state when mouse is lifted
        socket.broadcast.emit('mouseup', {});
      });
    
    socket.on('canvasClear', function(data) {        //clear canvas
        io.sockets.emit('clearCanvas', {});
      });
    
    socket.on('turnChange', function(data){
    	socket.emit('myTurn',{});
      });
    
    /******* FOR CHATBOX *******/
    										 
    // when the client emits 'sendchat', this listens and executes
    socket.on('sendchat', function (data, isDrawer) {  
    	// we tell the client to execute 'updatechat' with 2 parameters
      io.sockets.emit('updatechat', socket.username, data); 
      if (isDrawer == 0)  //cant guess if drawing
      {
    	  io.sockets.emit('checkGuess', data, socket.username);
      }
    });
    
    // when the client emits 'adduser', this listens and executes
    socket.on('adduser', function(username){    
      if (index > 4){return;}
    	// we store the username in the socket session for this client
      socket.username = username;			   	
      // add the client's username to the global list
      usernames[index] = username;
      socket.emit('setID', index);
      if (index == 0)
      {
    	  socket.emit('myTurn', {});
    	  socket.emit('drawer', {});
      }
      index += 1;
      // echo to client they've connected
      socket.emit('updatechat', 'SERVER', 'you have connected');
      // tell all clients that a person has connected
      socket.broadcast.emit('updatechat', 'SERVER', username + ' has connected');
      // update the list of users in chat, client-side
      io.sockets.emit('updateusers', usernames);     
      if (index == 2)
      {
    	  io.sockets.emit('startGame', {});
    	  socket.broadcast.emit('displayWord', {});
      }
    });

    // when the user disconnects.. perform this
    socket.on('disconnect', function(){
      for(var i=0; i<usernames.length;i++)
      {
    	// remove the username from global usernames list
    	if (usernames[i] == socket.username){usernames.splice(i,1);}  
      }
      index -= 1;   
      // update list of users in chat, client-side
      io.sockets.emit('updateusers', usernames);
      // echo globally that this client has left
      socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
    });
  });
}).call(this);
