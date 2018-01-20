'use strict';
import {module} from 'angular';

var app = module('myApp', []);
app.controller('myCtrl', [ '$scope', function($scope) {
	$scope.source = "(300,90,300)";
	$scope.target = "(100,100,300)";
	$scope.targetDestination = "(500,100,300)";
	$scope.sourceSpeed = 1;
	$scope.targetSpeed = 5;
	$scope.result = {err: null, time: 0, intersection: '', intersection2: ''};
	
	$scope.calc = function(){
		try {
			var source = unstringifyVector($scope.source);
			var target = unstringifyVector($scope.target);
			var targetDestination = unstringifyVector($scope.targetDestination);
			var sourceSpeed = $scope.sourceSpeed;
			var targetSpeed = $scope.targetSpeed;
			$scope.result = get_result(source, sourceSpeed, target, targetSpeed, targetDestination);
		} catch (err){
			$scope.result.err = err;
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
	var targetDirection = get_direction(target,targetDestination);
	var targetVelocity = get_velocity(targetDirection,targetSpeed);
	var time = get_collision_time(source, sourceSpeed, target, targetVelocity);
	var intersection = get_intersection(target,targetVelocity,time);
	var sourceDirection = get_direction(source,intersection);
	var sourceVelocity = get_velocity(sourceDirection,sourceSpeed);
	var intersection2 = get_intersection(source,sourceVelocity,time);
	return {
		err: null,
		time: time,
		intersection: stringifyVector(intersection), 
		intersection2: stringifyVector(intersection2),
	};
}

function get_collision_time(source, sourceSpeed, target, targetVelocity){
	var a = targetVelocity.x*targetVelocity.x + targetVelocity.y*targetVelocity.y + targetVelocity.z*targetVelocity.z - sourceSpeed*sourceSpeed;
	var b = 2*( targetVelocity.x*(target.x - source.x) + targetVelocity.y*(target.y - source.y) + targetVelocity.z*(target.z - source.z) ); 
	var c = (target.x - source.x)*(target.x - source.x) + (target.y - source.y)*(target.y - source.y) + (target.z - source.z)*(target.z - source.z); 
	var result = solve_quadratic_equation(a,b,c);
	if(result[0] < 0 && result[1] < 0) throw "Invalid collision time.";
	if(result[0] < 0) return result[1];
	if(result[1] < 0) return result[0];
	if(result[0] < result[1]) return result[0];
	return result[1];
}

function get_intersection(position,velocity,time){
	return {x: position.x + time*velocity.x, 
		y: position.y + time*velocity.y,
		z: position.z + time*velocity.z };
}

function get_direction(source,destination){
	var diff = {x: destination.x - source.x, y: destination.y - source.y, z: destination.z - source.z};
	var mag = Math.sqrt((diff.x*diff.x)+(diff.y*diff.y)+(diff.z*diff.z));
	diff.x /= mag; diff.y /= mag; diff.z /= mag;
	return diff;
}

function get_velocity(direction, speed){
	return {x: direction.x*speed, y: direction.y*speed, z: direction.z*speed};
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