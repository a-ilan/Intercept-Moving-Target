### To run
``` bash
npm install        # install dependencies
npm run build      # build production release in /dist directory
npm start          # start dev server at localhost:8080
```

### Finding collision
```
collisionPoint = target + targetVelocity*time;
distance = length(collisionPoint - source);
distance = length(target + targetVelocity*time - source);
time = distance/sourceSpeed;
time = length(target + targetVelocity*time - source)/sourceSpeed;
0 = length(target+targetVelocity*time-source) - time*sourceSpeed;	
0 = (target.x-source.x + t*targetVelocity.x)^2 + (target.y-source.y + t*targetVelocity.y)^2 + (target.z-source.z + t*targetVelocity.z)^2 - t^2 * sourceSpeed^2

var a = targetVelocity.x*targetVelocity.x + targetVelocity.y*targetVelocity.y + targetVelocity.z*targetVelocity.z - sourceSpeed*sourceSpeed;
var b = 2*( targetVelocity.x*(target.x - source.x) + targetVelocity.y*(target.y - source.y) + targetVelocity.z*(target.z - source.z) ); 
var c = (target.x - source.x)*(target.x - source.x) + (target.y - source.y)*(target.y - source.y) + (target.z - source.z)*(target.z - source.z); 
var time = solve_quadratic_equation(a,b,c);
```