'use strict';
import {module} from 'angular';
import {Vec} from './vectors.js';
import {Canvas} from './canvas.js';

var app = module('myApp', []);
app.controller('myCtrl', [ '$scope', function($scope) {
	$scope.source = "(100,-10,10)";
	$scope.target = "(50,50,50)";
	$scope.targetDestination = "(200,10,50)";
	$scope.sourceSpeed = 8;
	$scope.targetSpeed = 10;
	$scope.time = 0;
	$scope.result = null;
	$scope.err = null;
	$scope.draw = true;
	
	$scope.getString = function(vec){
		return Vec.getString(vec);
	}
	
	$scope.compute = function(){
		try {
			$scope.time = 0;
			$scope.result = null;
			var source = Vec.create($scope.source);
			var target = Vec.create($scope.target);
			var targetDestination = Vec.create($scope.targetDestination);
			var sourceSpeed = $scope.sourceSpeed;
			var targetSpeed = $scope.targetSpeed;
			$scope.result = getResult(source, sourceSpeed, target, targetSpeed, targetDestination);
			$scope.err = null;
		} catch (err){
			$scope.err = "Error: " + err;
		}
		$scope.draw = true;
	};
	
	$scope.onChangeInput = function(){
		$scope.time = 0;
		$scope.result = null;
		$scope.err = null;
		$scope.draw = false;
		$scope.compute();
	}
	
	$scope.onChangeTime = function(){
		try {
			var source = Vec.create($scope.source);
			var target = Vec.create($scope.target);
			var targetDestination = Vec.create($scope.targetDestination);
			var targetDirection = Vec.getDirection(target,targetDestination);
			var targetVelocity = Vec.getVelocity(targetDirection,$scope.targetSpeed);
			var targetPosition = Vec.getDestination(target,targetVelocity,$scope.time);
			var sourceDirection = Vec.getDirection(source,$scope.result.sourceDestination);
			var sourceVelocity = Vec.getVelocity(sourceDirection,$scope.sourceSpeed);
			var sourcePosition = Vec.getDestination(source,sourceVelocity,$scope.time);
			Canvas.draw(source,target,sourcePosition,targetPosition,$scope.result.sourceDestination,targetDestination);
		} catch(err){
			$scope.err = "Error: " + err;
		}
	};
	
	$scope.compute();
}]);

function getResult(source, sourceSpeed, target, targetSpeed, targetDestination){
	if(sourceSpeed < 0 || targetSpeed < 0) throw "Invalid speed";
	var targetDirection = Vec.getDirection(target,targetDestination);
	var targetVelocity = Vec.getVelocity(targetDirection,targetSpeed);
	var collisionTime = get_collision_time(source, sourceSpeed, target, targetVelocity);
	var targetArrivalTime = Vec.getTime(target,targetDestination,targetSpeed);
	if(collisionTime >= targetArrivalTime)
		throw "Missile cannot reach the target before the target arrives at its destination. Target arrival time: " + targetArrivalTime + ", Collision time: " + collisionTime + ".";
	var collisionPosition = Vec.getDestination(target,targetVelocity,collisionTime);
	var sourceDirection = Vec.getDirection(source,collisionPosition);
	var sourceVelocity = Vec.getVelocity(sourceDirection,sourceSpeed);
	var sourceDestination = Vec.getDestination(source,sourceVelocity,collisionTime);
	
	Canvas.draw(source,target,source,target,sourceDestination,targetDestination);
	
	return {
		time: collisionTime,
		collisionPosition: collisionPosition, 
		sourceDestination: sourceDestination,
	};
}

function get_collision_time(source, sourceSpeed, target, targetVelocity){
	var a = targetVelocity.x*targetVelocity.x + targetVelocity.y*targetVelocity.y + targetVelocity.z*targetVelocity.z - sourceSpeed*sourceSpeed;
	var b = 2*( targetVelocity.x*(target.x - source.x) + targetVelocity.y*(target.y - source.y) + targetVelocity.z*(target.z - source.z) ); 
	var c = (target.x - source.x)*(target.x - source.x) + (target.y - source.y)*(target.y - source.y) + (target.z - source.z)*(target.z - source.z); 
	if(a == 0){
		var time_result = -c/b;
		if(time_result < 0) throw "Missile is not fast enough to intercept the target. (Negative time)";
		return time_result;
	}
	var result = solve_quadratic_equation(a,b,c);
	if(result[0] < 0 && result[1] < 0) throw "Missile is not fast enough to intercept the target. (Negative time)";
	if(result[0] < 0) return result[1];
	if(result[1] < 0) return result[0];
	if(result[0] < result[1]) return result[0];
	return result[1];
}

function solve_quadratic_equation(a,b,c){
	//a*x^2 + b*x + c = 0
	//(-b (+/-) sqrt(b^2 - 4ac))/2a
	var must_be_positive = b*b - 4*a*c;
	if(must_be_positive < 0) throw "Missile is not fast enough to intercept the target. (Quadratic equation cannot be solved)";
	var x1 = (-b + Math.sqrt(must_be_positive))/(2*a);
	var x2 = (-b - Math.sqrt(must_be_positive))/(2*a);
	return [x1, x2];
} 