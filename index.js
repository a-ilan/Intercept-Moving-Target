

var source = {x: 10, y: 50, z: 100};
var target = {x: 100, y: 200, z: 300};
var sourceSpeed = 1;
var targetVelocity = {x: 5, y: -2, z: 3};

//quadratic_formula_time(-12,-5,5)

try {
	var result = document.getElementById("result");
	result.innerHTML = get_result(source, sourceSpeed, target, targetVelocity);
} catch (err){
	result.innerHTML = err;
}

function get_result(source, sourceSpeed, target, targetVelocity){
	var time = get_time(source, sourceSpeed, target, targetVelocity);
	var intersection = get_intersection(target,targetVelocity,time);
	var direction = get_direction(source,intersection);
	var sourceVelocity = {x: direction.x*sourceSpeed, y: direction.y*sourceSpeed, z: direction.z*sourceSpeed};
	var intersection2 = get_intersection(source,sourceVelocity,time);
	
	var intersection_str = stringifyVector(intersection);
	var intersection2_str = stringifyVector(intersection2);
	var direction_str = stringifyVector(direction);
	return 'Time: ' + time + '<br/>Intersection: ' + intersection_str + '<br/>Intersection: ' + intersection2_str + '<br/>Direction: ' + direction_str;
}

function get_time(source, sourceSpeed, target, targetVelocity){
	var a = targetVelocity.x*targetVelocity.x + targetVelocity.y*targetVelocity.y + targetVelocity.z*targetVelocity.z - sourceSpeed*sourceSpeed;
	var b = 2*( targetVelocity.x*(target.x - source.x) + targetVelocity.y*(target.y - source.y) + targetVelocity.z*(target.z - source.z) ); 
	var c = (target.x - source.x)*(target.x - source.x) + (target.y - source.y)*(target.y - source.y) + (target.z - source.z)*(target.z - source.z); 
	var result = quadratic_formula(a,b,c);
	if(result[0] < 0 && result[1] < 0) throw "Negative time.";
	if(result[0] < 0) return result[1];
	if(result[1] < 0) return result[0];
	if(result[0] < result[1]) return result[0];
	return result[1];
}

function get_intersection(target, targetVelocity,time){
	return {x: target.x + time*targetVelocity.x, 
		y: target.y + time*targetVelocity.y,
		z: target.z + time*targetVelocity.z };
}

function get_direction(source,intersection){
	var diff = {x: intersection.x - source.x, y: intersection.y - source.y, z: intersection.z - source.z};
	var mag = Math.sqrt((diff.x*diff.x)+(diff.y*diff.y)+(diff.z*diff.z));
	diff.x /= mag;
	diff.y /= mag;
	diff.z /= mag;
	return diff;
}

function stringifyVector(vec){
	return '(' + vec.x + ', ' + vec.y + ', ' + vec.z + ')'; 
}

function quadratic_formula(a,b,c){
	//a*x^2 + b*x + c = 0
	//(-b (+/-) sqrt(b^2 - 4ac))/2a
	var must_be_positive = b*b - 4*a*c;
	if(must_be_positive < 0) throw "Quadratic formula cannot be solved.";
	var x1 = (-b + Math.sqrt(must_be_positive))/(2*a);
	var x2 = (-b - Math.sqrt(must_be_positive))/(2*a);
	return [x1, x2];
} 