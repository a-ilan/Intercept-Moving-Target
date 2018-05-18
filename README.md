### To run
``` bash
npm install        # install dependencies
npm run build      # build production release in /dist directory
npm start          # start dev server at localhost:8080
```

### Intercepting a moving target problem
A missile needs to predict where a target is going to be in order to intercept it.<br/>
**known variables:** targetVelocity, target position, missile position, missileSpeed<br/>
**unknown variables:** time, collisionPoint, missileVelocity, missileDirection
```
collisionPoint = target + targetVelocity*time;
distance = length(collisionPoint - missile);
distance = length(target + targetVelocity*time - missile);
time = distance/missileSpeed;
time = length(target + targetVelocity*time - missile)/missileSpeed;
0 = length(target+targetVelocity*time-missile) - time*missileSpeed;	
0 = (target.x-missile.x + t*targetVelocity.x)^2 + (target.y-missile.y + t*targetVelocity.y)^2 + (target.z-missile.z + t*targetVelocity.z)^2 - t^2 * missileSpeed^2
```

### Solution to find the time
To solve the time it takes to intercept the target, you need to solve a quadratic equation.
Once you know the time, you can get the point of interception and the direction to launch the missile.
```
var a = targetVelocity.x*targetVelocity.x + targetVelocity.y*targetVelocity.y + targetVelocity.z*targetVelocity.z - missileSpeed*missileSpeed;
var b = 2*( targetVelocity.x*(target.x - missile.x) + targetVelocity.y*(target.y - missile.y) + targetVelocity.z*(target.z - missile.z) ); 
var c = (target.x - missile.x)*(target.x - missile.x) + (target.y - missile.y)*(target.y - missile.y) + (target.z - missile.z)*(target.z - missile.z); 
var time = solve_quadratic_equation(a,b,c);
```
