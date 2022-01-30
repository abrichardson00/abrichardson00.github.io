// initialize our list of bodies --------------------------------------------
		
const posSun = new Array(0.0, 0.0, 0.0);
const velSun = new Array(0.0, 0.0, 0.0);
const Sun = new Body("Sun", 696340, 0xFFA500, 1.989e30, posSun, velSun);



const posEarth = new Array(1.496e8, 0.0, 0.0);
const velEarth = new Array(0.0, getOrbitVelocity(Sun, 1.496e8), 0.0);
//console.log(velEarth);
const Earth = new Body("Earth", 6371, 0x0000FF, 5.9723e24, posEarth, velEarth);
//console.log(Earth.velocity);
//Earth = new Body("Earth", 100000, 0x00ff00, 5.9723e24, [1.496e8, 0.0, 0.0], [0.0, getOrbitVelocity(Sun, 1.496e8), 0.0]);

sunPosAU = [-7.864943109396809E-03, 4.673899442542716E-03, 1.455683187568342E-04]; // July 20th 2021
sunVelAU = [-5.231602942371734E-06, -7.446447041438200E-06, 1.836418676661004E-07];

//const posMars = AUtoKM(new Array(-1.564721514128016E+00, 5.947911716688973E-01, 5.070202167647228E-02));
//const posMars = [228000000.0, 0.0, 0.0];
//const velMars = [0.0, getOrbitVelocity(Sun, 228000000.0), 0.0];


// horizons outputs are (1 / 0.579230033241828) times too fast.



const posMars = AUtoKM([-1.556857281258715E+00, 5.901169693427317E-01, 5.055654073196206E-02]);
const velMars = AUDaytoKMSec([(-4.437337437546627E-03) , (-1.189060414264434E-02), (-1.403405464693856E-04)]);
//const velMars = [0.0, 0.0, 0.0];
//const velMars = AUtoKM(new Array(-4.442569042742078E-03 / (24.0*60.0), -1.189805058672411E-02 / (24.0*60.0), -1.401568954673739E-04 / (24.0*60.0)));
//const posMars = AUtoKMRelToSunPos(new Array(-1.564721514128016E+00, 5.947911716688973E-01, 5.070202167647228E-02));
//const velMars2 = AUtoKMRelToSunVel(new Array(-4.442569042742078E-03 * (0.694), -1.189805058672411E-02 * (0.694), -1.401568954673739E-04 * (0.694)));
//console.log(velMars);
/*


var sum1 = 0.0;
var sum2 = 0.0;
for (var i = 0; i < 3; i++) {
    sum1 += velMars[i]*velMars[i];
    sum2 += velMars2[i]*velMars2[i];
}
console.log(Math.sqrt(sum1));
console.log(Math.sqrt(sum2));
console.log(Math.sqrt(sum1) / Math.sqrt(sum2));
*/

const posVenus = AUtoKM([-7.034245306022904E-01, -1.529042031650763E-01, 3.849273556260027E-02]);
const velVenus = AUDaytoKMSec(new Array(4.165650828317724E-03, -1.985602606666400E-02, -5.128848456818808E-04));
const Venus = new Body("Venus", 6051.893 , 0x40e0d0, 48.685e23, posVenus, velVenus);

const Mars = new Body("Mars", 3396.19, 0xFF0000, 6.4171e23, posMars, velMars);
var bodies = [Sun, Venus, Earth, Mars];

function AUtoKM(a) {
    a[0] = (a[0])* 149597870.7; 
    a[1] = (a[1])* 149597870.7;
    a[2] = (a[2])* 149597870.7;
    return a;
}
function AUDaytoKMSec(a) {
    a[0] = ((a[0])* 149597870.7) / (24.0*60*60); 
    a[1] = ((a[1])* 149597870.7) / (24.0*60*60);
    a[2] = ((a[2])* 149597870.7) / (24.0*60*60);
    return a;
}
function AUtoKMRelToSunVel(a) {
    a[0] = (a[0] - sunVelAU[0])* 149597870.7; 
    a[1] = (a[1] - sunVelAU[1])* 149597870.7;
    a[2] = (a[2] - sunVelAU[2])* 149597870.7;
    return a;
}
function AUtoKMRelToSunPos(a) {
    a[0] = (a[0] - sunPosAU[0])* 149597870.7;
    a[1] = (a[1] - sunPosAU[1])* 149597870.7;
    a[2] = (a[2] - sunPosAU[2])* 149597870.7;
    return a;
}
//function AUperDayToKMperS

// setup the circles that appear on the screen --------------------------------
var bodyCircles = [];//new Array(bodies.length);
var scale = 1.0;
for (var i = 0; i < bodies.length; i++) {
    body = bodies[i];
    const geometry = new THREE.CircleGeometry(body.radius, 20); // or something like that?
    const material = new THREE.MeshBasicMaterial({color: body.colour});
    const circle = new THREE.Mesh(geometry, material);
    circle.position.x = body.position[0];
    circle.position.y = body.position[1];
    circle.position.z = body.position[2];
    var bodyScale = 1 + 8.0 * ((1 + Sun.radius - Math.sqrt(body.radius)) / (body.radius + 10000));
    circle.scale.x = bodyScale;
	circle.scale.y = bodyScale;
	circle.scale.z = bodyScale;
    // try this: circle.position = body.position; 
    scene.add(circle);
    //bodyCircles[i] = circle;
    bodyCircles.push(circle);
}

