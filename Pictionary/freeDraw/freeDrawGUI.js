/****************
 *   Free Draw  *
 ****************/

var canDraw = 0;
var erase = 0;
var lineWid = 2;
var color = "black";
var colors = ["red", "yellow", "green", "blue", "black"];
/*var 121 = 121;         //canvas X start   100
var 6 = 6;          // y start			160
var 560 = 560;         // x end			560
var 350 = 350;         // y end			350
*/
function init()
{
	var c = document.getElementById("myCanvas");
	var c2 = document.getElementById("myCanvas2");
	var ctx = c.getContext("2d"); 
	var ctx2 = c2.getContext("2d");
	var grd=ctx.createLinearGradient(0,0,780,600);
	grd.addColorStop(0.1,"white");           //color background
	grd.addColorStop(1,"blue");
	ctx.fillStyle=grd;
	ctx.fillRect(0,0,780,600);

	drawPencils(ctx,4);
	ctx.clearRect(121, 6, 560, 350);
	
	ctx2.strokeStyle = "black";
	ctx2.lineWidth=2;
	
	ctx2.strokeRect(121, 6, 560, 350);  //create drawing area
	ctx2.save();						//add shadow to drawing area
	ctx2.rect(121, 6, 560, 350);
	ctx2.fillStyle="white";
	ctx2.shadowColor="black";
	ctx2.shadowBlur=10;
	ctx2.shadowOffsetX=-10;
	ctx2.shadowOffsetY=10;
	ctx2.fill();
	ctx2.restore();
	
	roundRect(ctx, 27, 280, 80, 30, 10);    //eraser button
	ctx.fillStyle = "pink";
	ctx.fill();
	ctx.fillStyle = "black";
	ctx.font="20px Arial";
	ctx.fillText("Eraser", 39, 302);
	
	roundRect(ctx, 69, 320, 35, 30, 10);   //clear button
	ctx.fillText("Clr", 73, 342);
	
    ctx2.rect(121, 6, 560, 350);       //drawing area
    ctx.rect(121, 6, 560, 350);
    ctx.rect(680, 20, 780, 220);       //for size highlighting
    ctx.rect(0,10,100,245);            //for pencils
	ctx.rect(29, 283, 73, 22);		   //for eraser
	ctx.clip(); 
	ctx2.clip();
    
	ctx.fillStyle = "cyan";       //highlighted line width
	ctx.fillRect(682,80,100,25);
	
	drawLineWidths(ctx);          //line widths
	
}

function draw(event)
{	
	var x = event.clientX-9+window.pageXOffset;
	var y = event.clientY-9+window.pageYOffset;
	if (canDraw==1)	      //if the mouse is down track the cursor to draw
	{	
		if (erase==0){           //draw if eraser is not selected
			ctx2.lineTo(x,y);
			ctx2.stroke();
		}
		else{
			ctx2.lineTo(x,y);
			ctx2.stroke();} 
	}
}

function mousedown(event)
/*check where the user clicks*/
{
	c = document.getElementById("myCanvas");
	c2 = document.getElementById("myCanvas2");
	ctx = c.getContext("2d");
	ctx2 = c2.getContext("2d");
	var x = event.clientX-9+window.pageXOffset;
	var y = event.clientY-9+window.pageYOffset;
	//alert(x + " " + y);
	if (withinRect(x, y, 687, 81, 778, 209)){changeThickness(ctx,y);}
	if (withinRect(x, y, 5, 19, 119, 260)){changeColor(ctx, y);}
	if (withinRect(x, y, 72, 323, 107, 349)){clearCanvas();}
	if (withinRect(x, y, 29, 283, 108, 312)){eraser();}
	
	ctx2.lineWidth= lineWid;
	ctx2.lineCap = "round";		//round endpoints
	ctx2.lineJoin='round';		//round edges

	if(x>111){
		if(erase==0){
			ctx2.beginPath();
			ctx2.strokeStyle = color;
			ctx2.moveTo(x,y);
			ctx2.lineTo(x+1,y);
			ctx2.stroke();
		}
		else{
			ctx2.save();
			ctx2.beginPath();
			ctx2.globalCompositeOperation = "destination-out"; 
			ctx2.strokeStyle = "rgba(0,0,0,1,0)"; 
			ctx2.moveTo(x,y);
			ctx2.lineTo(x+1,y);
			ctx2.stroke();

			//ctx.clearRect(x-10+15,y-10+50,15,15);
		}
	canDraw = 1;
	}
}

function mouseup(event)
{
	if (erase==1){ctx2.restore();}
	canDraw = 0;    		 //stop drawing when mouse is released
}

function changeColor(ctx, y)
/*redraws the pencils and shows which one is selected*/
{	
	canDraw = 0;
	ctx.clearRect(2, 19, 80, 260);
	var grd=ctx.createLinearGradient(0,0,780,600);
	grd.addColorStop(0.1,"white");      //color background
	grd.addColorStop(1,"blue");
	ctx.fillStyle=grd;
	ctx.fillRect(2, 19, 80, 260);
	
	if (y<57){    //red
		color = colors[0];
		drawPencils(ctx,0);
	}
	else if (y<108){    //yellow
		color = colors[1];
		drawPencils(ctx,1);
	}
	else if (y<159){    //green
		color = colors[2];
		drawPencils(ctx,2);
	}
	else if (y<209){    //blue
		color = colors[3];
		drawPencils(ctx,3);
	}
	else if (y<259){     //black
		color = colors[4];
		drawPencils(ctx,4);
	}
	else{		/*keep the pencil on the current color if not different*/
		if (color == "red"){drawPencils(ctx,0);}
		else if (color == "yellow"){drawPencils(ctx,1);}
		else if (color == "green"){drawPencils(ctx,2);}
		else if (color == "blue"){drawPencils(ctx,3);}
		else {drawPencils(ctx,4);}
	}
}

function clearCanvas()
{
	ctx2.fillStyle="white";    //erase the drawing area
	ctx2.fillRect(121, 6, 560, 350);
}

function eraser()
{
	ctx.clearRect(33, 283, 73, 22);
	ctx.fillStyle = "pink";
	ctx.fillRect(33, 283, 73, 22);
	ctx.fillStyle = "black";
	if (erase){     //select pencil again
		erase = 0;
		draweraser.style.cursor ='url(../pictures/pencil.gif),auto';
		ctx.fillText("Eraser", 39, 302);
	}
	else{            //select eraser
		draweraser = document.getElementById("myCanvas2")
		draweraser.style.cursor ='url(../pictures/eraser.png),auto';
		ctx.fillText("Pencil", 39, 302);
		erase=1;
	}
}

function changeThickness(ctx, yValue)
{
	ctx.clearRect(680, 81, 780, 220);
	var grd=ctx.createLinearGradient(0,0,780,600);
	grd.addColorStop(0.1,"white");      //color background
	grd.addColorStop(1,"blue");
	ctx.fillStyle=grd;
	ctx.fillRect(682, 78, 780, 220);
	ctx.beginPath();
	ctx.fillStyle = "cyan";    			 //highlighted line
	if (yValue < 106){
		lineWid = 2;
		ctx.fillRect(682,80,100,25);     //small
	}
	else if(yValue < 157){
		lineWid = 10;
		ctx.fillRect(682,125,100,30);     //medium
	}
	else{
		lineWid = 30;
		ctx.fillRect(682,170,100,40);     //large
	}
	drawLineWidths(ctx);
}