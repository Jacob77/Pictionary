/****************
 *  Chat Script *
 ****************/
var current_word = '';
var current_index = 0;
var words= ['unicorn', 'bike','lemon','chocolate','pizza','apple','tree','cat','dog'];
var drawing = 0;
var drawList = [1,0];
var id = -1;

function new_word()
{
	current_word = words[current_index]; //querry database for new word
	current_index += 1;
}

function check_guess(guess)
{
	//compare guess to current word
	if (guess.length == current_word.length)
	{
		if (guess == current_word)
		{
			new_word();
			return true;
		}
	}
}

function distribute_points(right_guesser, drawer)
{
	//give points to the one who got the answer right and the drawer
}

function win()
{
	//compare points of all contestants at end of game
}

function user_turn(user, users)
{
	for (var i = 0; i<users.length; i++)
	{
		if (users[i]==user)
		{
			return i;
		}
	}
	//tell user how many more rounds until their turn to draw
}

function displayWord()
{
	socket.emit('canvasClear',0);
	if(drawing == 1)
	 {
		 alert("Your word is: "+current_word);
	 }
}

/* some of the following code was taken from a web site tutorial and was modified for our application.
site name = http://psitsmike.com/2011/09/node-js-and-socket-io-chat-tutorial/ */

var socket = io.connect('http://localhost:8080');

  // on connection to server, ask for user's name with an anonymous callback
  socket.on('connect', function(){
    // call the server-side function 'adduser' and send one parameter (value of prompt)
    socket.emit('adduser', prompt("What's your name?"));
  });

  // listener, whenever the server emits 'updatechat', this updates the chat body
  socket.on('updatechat', function (username, data) {
    $('#conversation').append('<b>'+username + ':</b> ' + data + '<br>');
    $('#data').focus();
    $("#chatbox").prop({ scrollTop: $("#chatbox").prop("scrollHeight") });
  });

  // listener, whenever the server emits 'updateusers', this updates the username list
  socket.on('updateusers', function(data) {
    $('#users').empty();
    for (var name in data){
    $('#users').append('<div>' + data[name] + '</div>');}
  });
  
  socket.on('startGame', function(data){
	  	 if(drawing != 1){alert("Game is starting...");}
		 new_word();
  });
  
  socket.on('displayWord', function(data){
	  	 socket.emit('canvasClear',0);
		 if(drawing == 1)
		 {
			 alert("Your word is: "+current_word);
		 }
  });
  
  socket.on('checkGuess', function(data, username){
	 if(check_guess(data))
	 {
		 for (var i=0; i<drawList.length;i++)
		 {
			 if(drawList[i] == 1)
			 {
				 drawing = 0;
				 drawList[i] = 0;
				 if(i==drawList.length-1){drawList[0] = 1; person = 0;}
				 else{drawList[i+1] = 1; person = i+1;}
				 if(id == i){socket.emit('turnChange',{});}
				 break;
			 }
		 }
		 alert(username+" got it! The word was "+data);
		 if (id == person)
		 {
			 socket.emit('turnChange',{});
			 drawing = 1;
			 displayWord();
		 }
	  }
  });
  
  socket.on('nextTurn', function(){
	 var person = -1;
	 for (var i=0; i<drawList.length;i++)
	 {
		 if(drawList[i] == 1)
		 {
			 
			 drawList[i] = 0;
			 if(i==drawList.length-1){drawList[0] = 1; person = 1;}
			 else{drawList[i+1] = 1; person = i+1;}
			 socket.emit('turnChange',{});
			 break;
		 }
	 }
	 if (id == person){socket.emit('turnChange',{});}
  });
  
  socket.on('drawer', function(data){
		 drawing = 1;
  });
  
  socket.on('setID', function(data){
	 id = data; 
  });

  // on load of page
  $(function(){
    // when the client clicks SEND
    $('#datasend').click( function() {
      var message = $('#data').val();
      if (message == ''){return;}
      $('#data').val('');
      // tell server to execute 'sendchat' and send along one parameter
        socket.emit('sendchat', message, drawing);
      $('#data').focus();
      $("#chatbox").prop({ scrollTop: $("#chatbox").prop("scrollHeight") });
    });

    // when the client hits ENTER on their keyboard
    $('#data').keypress(function(e) {
      if(e.which == 13) {
        $(this).blur();
        $('#datasend').focus().click();
        $('#data').focus();
        $("#chatbox").prop({ scrollTop: $("#chatbox").prop("scrollHeight") });
      }
    });
  });