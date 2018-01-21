var Canvas = {};
module.exports.Canvas = Canvas;

function drawArrow(ctx, from, to){
	var headlen = 10;   // length of head in pixels
	var angle = Math.atan2(to.y-from.y,to.x-from.x);
	ctx.beginPath();
	ctx.moveTo(from.x, from.y);
	ctx.lineTo(to.x, to.y);
	ctx.lineTo(to.x-headlen*Math.cos(angle-Math.PI/6),to.y-headlen*Math.sin(angle-Math.PI/6));
	ctx.moveTo(to.x, to.y);
	ctx.lineTo(to.x-headlen*Math.cos(angle+Math.PI/6),to.y-headlen*Math.sin(angle+Math.PI/6));
	ctx.lineWidth = 2;
	ctx.strokeStyle = "#000000";
	ctx.stroke();
}

function drawCircle(ctx, position){
	ctx.beginPath();
	ctx.arc(position.x,position.y,10,0,2*Math.PI,false);
	ctx.fill();
	ctx.lineWidth = 2;
	ctx.strokeStyle = "#000000";
	ctx.stroke();
}

Canvas.draw = function(sourceInitPosition,targetInitPosition,
								sourcePosition,targetPosition,
								sourceDestination,targetDestination) {
	var canvas = document.getElementById('canvas');
	if(canvas.getContext) {
		var ctx = canvas.getContext('2d');
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		
		var t = getTransform(sourceInitPosition,targetInitPosition,sourceDestination,targetDestination,canvas.width,canvas.height);
		var a = transform(t,sourceInitPosition); // point A
		var b = transform(t,targetInitPosition); // point B
		var c = transform(t,sourceDestination); // point C
		var d = transform(t,targetDestination); // point D
		
		ctx.font = "12px Monospace";
		ctx.textAlign = "center";
		ctx.fillStyle = "black";
		ctx.textBaseline = "bottom";
		ctx.fillStyle = 'black';
		ctx.fillText("Missile",a.x,a.y-10);
		ctx.fillText("Target",b.x,b.y-10);
		
		ctx.fillStyle = 'blue';
		drawArrow(ctx, b, d);
		drawCircle(ctx, transform(t,targetPosition));
		
		ctx.fillStyle = 'green';
		drawArrow(ctx, a, c);
		drawCircle(ctx, transform(t,sourcePosition));
	}
}

function getTransform(a,b,c,d, canvas_width, canvas_height){
	var margin = 20;
	var minX = Math.min(a.x,b.x,c.x,d.x)-margin;
	var minY = Math.min(a.y,b.y,c.y,d.y)-margin;
	var maxX = Math.max(a.x,b.x,c.x,d.x)+margin;
	var maxY = Math.max(a.y,b.y,c.y,d.y)+margin;
	var width = (maxX - minX)/canvas_width;
	var height = (maxY - minY)/canvas_height;
	return {x: minX, y: minY, width: width, height: height};
}

function transform(t, vec){
	return {x: (vec.x - t.x) / t.width, y: (vec.y - t.y) / t.height};
}