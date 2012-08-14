/****************
 *Draw Functions*
 ****************/

function roundRect(ctx, x, y, width, height, radius) 
{
	ctx.beginPath();
	ctx.moveTo(x + radius, y);
	ctx.lineTo(x + width - radius, y);
	ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
	ctx.lineTo(x + width, y + height - radius);
	ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
	ctx.lineTo(x + radius, y + height);
	ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
	ctx.lineTo(x, y + radius);
	ctx.quadraticCurveTo(x, y, x + radius, y);
	ctx.closePath();
	ctx.stroke();
}

function drawPencil(ctx,x,y,color1,length)
{
	ctx.lineWidth = 1;
	ctx.save();
	ctx.beginPath();	      //base of pencil
	ctx.moveTo(x,y);
	ctx.lineTo(x,y+32);
	ctx.lineTo(x+length,y+32);
	ctx.lineTo(x+length+8,y+24);
	ctx.lineTo(x+length,y+16);
	ctx.lineTo(x+length+8,y+8);
	ctx.lineTo(x+length,y);
	ctx.lineTo(x,y);
	ctx.stroke();
	ctx.closePath();
	ctx.fillStyle = color1;
	ctx.fill();
	
	ctx.moveTo(x+length+8,y+24);  //lines on pencil
	ctx.lineTo(x,y+24);
	ctx.stroke();
	ctx.moveTo(x+length+8,y+8);
	ctx.lineTo(x,y+8);
	ctx.stroke();
	
	ctx.beginPath();                //pencil point
	ctx.moveTo(x+length,y+32);
	ctx.lineTo(x+length+8,y+24);
	ctx.lineTo(x+length,y+16);
	ctx.lineTo(x+length+8,y+8);
	ctx.lineTo(x+length,y);
	ctx.lineTo(x+length-25,y+16);
	ctx.lineTo(x+length,y+32);
	ctx.stroke();
	ctx.closePath();
	ctx.fillStyle = "#FFFF66";
	ctx.fill();
	
	ctx.fillStyle = color1;
	ctx.strokeStyle = color1;
	ctx.beginPath();              //pencil tip
	ctx.moveTo(x+length-21,y+17);
	ctx.lineTo(x+length-21,y+14);
	ctx.lineTo(x+length-25,y+16);
	ctx.lineTo(x+length-21,y+18);
	ctx.lineTo(x+length-21,y+19);
	ctx.stroke();
	ctx.closePath();
	ctx.fill();
	ctx.restore();
}

function drawPencils(ctx,selected)
{
	for(var i = 0; i < 5; i++){
		if (i == selected){
			drawPencil(ctx,120,20+i*50,colors[i],-90);
		}
		else{
			drawPencil(ctx,120,20+i*50,colors[i],-50);
		}
	}
}

function withinRect(x, y, xs, ys, xe, ye)
/*boundary detection -returns true if the x and y coords are within the rect*/
{	if (x>xs && x<xe && y>ys && y<ye){return true;}	}

/*
function drawLineWidthArea(ctx)
{
	ctx.lineWidth = 2;
	ctx.fillStyle="lightgreen";
	roundRect(ctx, 35, 150, 120, 150, 10);  //round rectangle around lines
	ctx.fill();
	ctx.fillStyle = "black";
	ctx.font="20px Arial";
	ctx.fillText("Size", 710, 50);    //text
};
*/
function drawLineWidths(ctx)
{
	ctx.fillStyle = "black";
	ctx.font="20px Arial";
	ctx.fillText("Size", 710, 50);    //text
	ctx.strokeStyle = "black";
    var lineX = 700;				/* line widths */
	ctx.lineCap = "round";
	ctx.beginPath();
	ctx.lineWidth=2;
	ctx.moveTo(lineX-5,90);        //thin line
	ctx.lineTo(lineX+65,90);
	ctx.stroke();
	ctx.closePath();
	ctx.lineWidth=10;
	ctx.beginPath();              //medium line
	ctx.moveTo(lineX-5,140);
	ctx.lineTo(lineX+65,140);
	ctx.stroke();
	ctx.lineWidth=30;             //thick line
	ctx.beginPath();
	ctx.moveTo(lineX,190);
	ctx.lineTo(lineX+60,190);
	ctx.stroke();
	
};