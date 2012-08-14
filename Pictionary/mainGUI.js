/****************
 *   mainGUI    *
 ****************/

var canDraw = 0;
var erase = 0;
var lineWid = 2;
var color = "black";
var colors = ["red", "yellow", "green", "blue", "black"];
var app = {};
var ismyTurn = 0;
var current_word = '';

(function() {
	app.init = function()
	{
		app.canvas = document.createElement('canvas');
		app.canvas2 = document.createElement('canvas');
		app.canvas.setAttribute('id', 'myCanvas');
		app.canvas2.setAttribute('id', 'myCanvas2');
		app.canvas.height = 635;
		app.canvas.width = 780;
		app.canvas2.height = 635;
		app.canvas2.width = 780;
		document.getElementsByTagName('article')[0].appendChild(app.canvas);
		document.getElementsByTagName('article')[0].appendChild(app.canvas2);
		app.ctx = app.canvas.getContext("2d");
		app.ctx2 = app.canvas2.getContext("2d");
		var grd = app.ctx.createLinearGradient(0,0,780,635);
		grd.addColorStop(0.1,"white");                   //color background
		grd.addColorStop(1,"grey");
		app.ctx.fillStyle=grd;
		app.ctx.fillRect(0,0,780,635);
		
		drawPencils(app.ctx,4);
		app.ctx.clearRect(121, 6, 560, 350);
		
		app.ctx2.strokeStyle = color;
		app.ctx2.lineWidth=2;
		
		app.ctx2.strokeRect(121, 6, 560, 350);  //create drawing area
		app.ctx2.save();							      //add shadow to drawing area
		app.ctx2.rect(121, 6, 560, 350);
		app.ctx2.fillStyle="white";
		app.ctx2.shadowColor="black";
		app.ctx2.shadowBlur=10;
		app.ctx2.shadowOffsetX=-10;
		app.ctx2.shadowOffsetY=10;
		app.ctx2.fill();
		app.ctx2.restore();
		
		roundRect(app.ctx, 27, 280, 80, 30, 10);    //eraser button
		app.ctx.fillStyle = "pink";
		app.ctx.fill();
		app.ctx.fillStyle = "black";
		app.ctx.font="20px Arial";
		app.ctx.fillText("Eraser", 39, 302);
		
		roundRect(app.ctx, 69, 320, 35, 30, 10);   //clear button
		app.ctx.fillText("Clr", 73, 342);
		
	    app.ctx2.rect(121, 6, 560, 350);    //drawing area
	    app.ctx.rect(121, 6, 560, 350);
	    app.ctx.rect(680, 20, 780, 220);               //for size highlighting
		app.ctx.rect(0,10,100,245);                    //for pencils
		app.ctx.rect(29, 283, 73, 22);		     	   //for eraser
		app.ctx.clip();
		app.ctx2.clip();
	    
		app.ctx.fillStyle = "cyan";       					//highlighted line width
		app.ctx.fillRect(682,80,100,25);
		
		drawLineWidths(app.ctx);          				 	//line widths
		
															/* Socket Events */
		app.socket = io.connect('http://localhost:8080');
	    app.socket.on('draw', function(data) {               //draw to clients
	    	app.draw(data.x, data.y, data.hasErase);
	    });
	    
	    app.socket.on('mousedown', function(data) {          //mouse lifted and moved
	    	app.mousedown(data.x, data.y, data.downColor, data.hasErase);
	    });
	    
	    app.socket.on('mouseup', function(data) {          //mouse lifted and moved
	    	app.ctx2.restore();
	    	canDraw = 0;
	    });
	    
	    app.socket.on('changeColor', function(data) {        //show what color changed
	    	app.changeColor(data.y);
	    });
	    
	    app.socket.on('changeThickness', function(data) {    //change line width for clients
	    	app.changeThickness(data.y);
	    });
	    
	    app.socket.on('clearCanvas', function(data) {        //clear canvas
	    	app.clearCanvas();
	    });
	    
	    app.socket.on('myTurn', function(data){   //players turn
	    	if(ismyTurn){ismyTurn = 0;}
	    	else{ismyTurn = 1;}
	    });
	    
	    
	    /* Methods  */
	    app.mouseup = function()
	    {
	    	if(erase == 1){app.ctx2.restore();}
			canDraw = 0;    		 						//stop drawing when mouse is released
	    }
	    
	    app.mousedown = function(x,y,downColor, hasErase)       
	    {											//sends color and moves mouse position to start drawing
	    	if(x>111){
				if(hasErase==0){
					app.ctx2.beginPath();
					app.ctx2.strokeStyle = downColor;
			    	app.ctx2.moveTo(x,y);
			    	app.ctx2.lineTo(x+1,y+1);
					app.ctx2.stroke();
				}
				else{
					app.ctx2.save();
					app.ctx2.beginPath();
					app.ctx2.globalCompositeOperation = "destination-out"; //black transparent line
					app.ctx2.strokeStyle = "rgba(0,0,0,1,0)"; 
					app.ctx2.moveTo(x,y);
					app.ctx2.lineTo(x+1,y+1);
					app.ctx2.stroke();
				}
				canDraw = 1;
			}
	    };
	    
		app.draw = function(x,y,hasErase)
		{
			if (hasErase==0){                              //draw if eraser is not selected
				app.ctx2.lineTo(x,y);
				app.ctx2.stroke();
			}
			else{												//eraser selected, so erase
				app.ctx2.globalCompositeOperation = "destination-out"; 
				app.ctx2.strokeStyle = "rgba(0,0,0,1,0)";
				app.ctx2.lineTo(x,y);
				app.ctx2.stroke();
			}
		};
		
		app.changeColor = function(y)
		/*redraws the pencils and shows which one is selected*/
		{	
			canDraw = 0;
			app.ctx.clearRect(2, 19, 80, 260);
			var grd = app.ctx.createLinearGradient(0,0,780,600);
			grd.addColorStop(0.1,"white");      //color background
			grd.addColorStop(1,"grey");
			app.ctx.fillStyle=grd;
			app.ctx.fillRect(2, 19, 80, 260);
			
			if (y<57){         //red
				color = colors[0];
				drawPencils(app.ctx,0);
			}
			else if (y<108){    //yellow
				color = colors[1];
				drawPencils(app.ctx,1);
			}
			else if (y<159){    //green
				color = colors[2];
				drawPencils(app.ctx,2);
			}
			else if (y<209){    //blue
				color = colors[3];
				drawPencils(app.ctx,3);
			}
			else if (y<259){     //black
				color = colors[4];
				drawPencils(app.ctx,4);
			}
			else{		/*keep the pencil on the current color if not different*/
				if (color == "red"){drawPencils(app.ctx,0);}
				else if (color == "yellow"){drawPencils(app.ctx,1);}
				else if (color == "green"){drawPencils(app.ctx,2);}
				else if (color == "blue"){drawPencils(app.ctx,3);}
				else {drawPencils(app.ctx,4);}
			}
		};
	
		app.clearCanvas = function()
		{
			app.ctx2.fillStyle = "white"; //erase the drawing area
			app.ctx2.fillRect(121, 6, 560, 350);
		};
	
		app.eraser = function()
		{
			app.ctx.clearRect(33, 283, 73, 22);
			app.ctx.fillStyle = "pink";
			app.ctx.fillRect(33, 283, 73, 22);
			app.ctx.fillStyle = "black";
			if (erase){     //select pencil again
				erase = 0;
				draweraser.style.cursor ='url(pictures/pencil.gif),auto';
				app.ctx.fillText("Eraser", 39, 302);
			}
			else{            //select eraser
				draweraser = document.getElementById("myCanvas2")
				draweraser.style.cursor ='url(pictures/eraser.png),auto';
				app.ctx.fillText("Pencil", 39, 302);
				erase=1;
			}
		};
		
		app.myTurn = function(){ismyTurn = 1};
	
		app.changeThickness = function(yValue)
		{
			app.ctx.clearRect(680, 81, 780, 220);
			var grd=app.ctx.createLinearGradient(0,0,780,600);
	 		grd.addColorStop(0.1,"white");      //color background
	 		grd.addColorStop(1,"grey");
	 		app.ctx.fillStyle=grd;
	 		app.ctx.fillRect(682, 78, 780, 220);
			app.ctx.beginPath();
			app.ctx.fillStyle = "cyan";    			 //highlighted line
			if (yValue < 106){
				lineWid = 2;
				app.ctx.fillRect(682,80,100,25);     //small
			}
			else if(yValue < 157){
				lineWid = 10;
				app.ctx.fillRect(682,125,100,30);     //medium
			}
			else{
				lineWid = 30;
				app.ctx.fillRect(682,170,100,40);     //large
			}
			drawLineWidths(app.ctx);
			app.ctx2.lineWidth = lineWid;
			app.ctx2.lineCap = "round";		//round endpoints
			app.ctx2.lineJoin='round';		//round edges
		};
	};
	
	$(function() {
	    return app.init();
	  });
	}).call(this);
	
	/* Start mouse listeners */
	
	$(document).ready(function(){
	$('canvas').mousemove(function(event)
	{
		if (canDraw==1 && ismyTurn == 1 )	      //if the mouse is down track the cursor to draw
		{	
			var x = event.clientX-9+window.pageXOffset;
			var y = event.clientY-9+window.pageYOffset;
			app.draw(x,y,erase);
			app.socket.emit('drawClick', {          //send draw coords to server
				x: x,
				y: y,
				hasErase: erase
			});
		}
	});
	
	$('canvas').mousedown(function(event)
	{
		if (ismyTurn==1){
		var x = event.clientX-9+window.pageXOffset;
		var y = event.clientY-9+window.pageYOffset;
		
		if (withinRect(x, y, 5, 19, 119, 260)){       //change color if clicked a pencil
			app.changeColor(y);
			app.socket.emit('colorChange', {
				y: y
			});
		}
		
		if (withinRect(x, y, 72, 323, 107, 349)){   //clear canvas if clear button is clicked
			app.clearCanvas();
			app.socket.emit('canvasClear', {
			});
		}
		
		if (withinRect(x, y, 29, 283, 108, 312)){app.eraser();}    //use eraser if eraser button is clicked
		
		if (withinRect(x, y, 687, 81, 778, 209)){             //change thickness if within line width area
			app.changeThickness(y);
			app.socket.emit('thicknessChange', {             //send changed thickness to server
				y: y
			});
		}
		
		app.ctx2.lineCap = "round";		//round endpoints
		app.ctx2.lineJoin= 'round';		//round edges
		
		app.mousedown(x,y,color,erase);
		app.socket.emit('drawMove', {    //send mousedown coords and color to server
			x: x,
			y: y,
			downColor: color,
			hasErase: erase
		});
		}
	});
	
	$('canvas').mouseup( function(event)
	{
		if (ismyTurn==1){
		app.mouseup();
		app.socket.emit('upmouse', {});
		}
	});
	
/*	$('canvas').mouseout(function(event)
	{
		app.mouseup();
		app.socket.emit('upmouse', {});
	});*/
});