var Vec = {};
module.exports.Vec = Vec;

Vec.create = function(str){
	var re = /^\s*\(\s*-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?\s*\)\s*$/;
	var number = /-?\d+(\.\d+)?/g;
	if(!re.test(str)) throw 'Cannot parse vecor: ' + str;
	return {x: +number.exec(str)[0], y: +number.exec(str)[0], z: +number.exec(str)[0]};
}

Vec.getString = function(vec){
	return '(' + round(vec.x) + ', ' + round(vec.y) + ', ' + round(vec.z) + ')'; 
}

function round(value){
	return Number(Math.round(value*100)/100);
}

Vec.length = function(vec){
	//magnitude/norm/length of a vector
	return Math.sqrt((vec.x*vec.x)+(vec.y*vec.y)+(vec.z*vec.z));
}

Vec.getDestination = function(source,velocity,time){
	return {x: source.x + time*velocity.x, 
		y: source.y + time*velocity.y,
		z: source.z + time*velocity.z };
}

Vec.getTime = function(source,destination,speed){
	var diff = {x: destination.x - source.x, y: destination.y - source.y, z: destination.z - source.z};
	var length = Vec.length(diff);
	if(length == 0) return 0;
	return length/speed;
}

Vec.getDirection = function(source,destination){
	var diff = {x: destination.x - source.x, y: destination.y - source.y, z: destination.z - source.z};
	var length = Vec.length(diff);
	if(length == 0) return {x:0,y:0,z:0};
	diff.x /= length; diff.y /= length; diff.z /= length;
	return diff;
}

Vec.getVelocity = function(direction, speed){
	return {x: direction.x*speed, y: direction.y*speed, z: direction.z*speed};
}