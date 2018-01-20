'use strict';
import {module} from 'angular';

var app = module('myApp', []);
app.controller('myCtrl', [ '$scope', function($scope) {
	$scope.source = "(100,10,40)";
	$scope.target = "(50,50,50)";
	$scope.targetDestination = "(200,10,50)";
	$scope.sourceSpeed = 3;
	$scope.targetSpeed = 5;
	$scope.result = {time: 0, collisionPosition: '', sourceDestination: ''};
	$scope.err = null;
	
	$scope.calc = function(){
		try {
			var source = unstringifyVector($scope.source);
			var target = unstringifyVector($scope.target);
			var targetDestination = unstringifyVector($scope.targetDestination);
			var sourceSpeed = $scope.sourceSpeed;
			var targetSpeed = $scope.targetSpeed;
			$scope.result = get_result(source, sourceSpeed, target, targetSpeed, targetDestination);
			$scope.err = null;
		} catch (err){
			$scope.err = err;
		}
	};
	$scope.calc();
}]);

function unstringifyVector(str){
	var re = /^\s*\(\s*-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?\s*\)\s*$/;
	var number = /-?\d+(\.\d+)?/g;
	if(!re.test(str)) throw 'invalid vecor: ' + str;
	return {x: +number.exec(str)[0], y: +number.exec(str)[0], z: +number.exec(str)[0]};
}

function stringifyVector(vec){
	return '(' + round(vec.x) + ', ' + round(vec.y) + ', ' + round(vec.z) + ')'; 
}

function round(value,decimals=2){
	return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

function get_result(source, sourceSpeed, target, targetSpeed, targetDestination){
	if(sourceSpeed < 0 || targetSpeed < 0) throw "Invalid speed";
	var targetDirection = get_direction(target,targetDestination);
	var targetVelocity = get_velocity(targetDirection,targetSpeed);
	var collisionTime = get_collision_time(source, sourceSpeed, target, targetVelocity);
	var targetArrivalTime = get_time(target,targetDestination,targetSpeed);
	if(collisionTime >= targetArrivalTime)
		throw "Target reaches its destination before the collision. Target arrival time: " + targetArrivalTime + ", Collision time: " + collisionTime + ".";
	var collisionPosition = get_destination(target,targetVelocity,collisionTime);
	var sourceDirection = get_direction(source,collisionPosition);
	var sourceVelocity = get_velocity(sourceDirection,sourceSpeed);
	var sourceDestination = get_destination(source,sourceVelocity,collisionTime);
	return {
		time: collisionTime,
		collisionPosition: stringifyVector(collisionPosition), 
		sourceDestination: stringifyVector(sourceDestination),
	};
}

function get_collision_time(source, sourceSpeed, target, targetVelocity){
	var a = targetVelocity.x*targetVelocity.x + targetVelocity.y*targetVelocity.y + targetVelocity.z*targetVelocity.z - sourceSpeed*sourceSpeed;
	var b = 2*( targetVelocity.x*(target.x - source.x) + targetVelocity.y*(target.y - source.y) + targetVelocity.z*(target.z - source.z) ); 
	var c = (target.x - source.x)*(target.x - source.x) + (target.y - source.y)*(target.y - source.y) + (target.z - source.z)*(target.z - source.z); 
	if(a == 0) return -c/b; // t = -c/b
	var result = solve_quadratic_equation(a,b,c);
	if(result[0] < 0 && result[1] < 0) throw "Invalid collision time.";
	if(result[0] < 0) return result[1];
	if(result[1] < 0) return result[0];
	if(result[0] < result[1]) return result[0];
	return result[1];
}

function solve_quadratic_equation(a,b,c){
	//a*x^2 + b*x + c = 0
	//(-b (+/-) sqrt(b^2 - 4ac))/2a
	var must_be_positive = b*b - 4*a*c;
	if(must_be_positive < 0) throw "Quadratic equation cannot be solved.";
	var x1 = (-b + Math.sqrt(must_be_positive))/(2*a);
	var x2 = (-b - Math.sqrt(must_be_positive))/(2*a);
	return [x1, x2];
} 

function get_destination(source,velocity,time){
	return {x: source.x + time*velocity.x, 
		y: source.y + time*velocity.y,
		z: source.z + time*velocity.z };
}

function get_time(source,destination,speed){
	var diff = {x: destination.x - source.x, y: destination.y - source.y, z: destination.z - source.z};
	var length = get_length(diff);
	return length/speed;
}

function get_direction(source,destination){
	var diff = {x: destination.x - source.x, y: destination.y - source.y, z: destination.z - source.z};
	var length = get_length(diff);
	diff.x /= length; diff.y /= length; diff.z /= length;
	return diff;
}

function get_velocity(direction, speed){
	return {x: direction.x*speed, y: direction.y*speed, z: direction.z*speed};
}

function get_length(vec){
	//magnitude/norm/length of a vector
	return Math.sqrt((vec.x*vec.x)+(vec.y*vec.y)+(vec.z*vec.z));
}