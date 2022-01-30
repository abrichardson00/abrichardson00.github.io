const GRAV_CONSTANT_KM = 6.67408e-20;//6.67408e-11;
var timestep = 1000;

function unitVec(r) {
    
    sq = r.map(i => i*i);
    mag = Math.sqrt(sq.reduce((a, b) => a + b, 0));
    return r.map(i => i / mag);
};

function subtractArray(a, b) {
    c = new Array(3);
    for (var i = 0; i < 3; i++) {
        c[i] = a[i] - b[i];
    }
    return c;
}

function setArray(a, x, y, z) {
    a[0] = x;
    a[1] = y;
    a[2] = z;
}

function dot(a, b) {
    sum = 0;
    for (var i = 0; i < 3; i++) {
        sum += a[i]*b[i];
    }
    return sum;
}

function update2BodyForces(body1, body2) 
{
    //r12 = body2.position - body1.position;
    //r21 = body1.position - body2.position;
    r12 = subtractArray(body2.position, body1.position);
    r21 = subtractArray(body1.position, body2.position);
    // update the force on each 2 bodies
    gm1m2 = (GRAV_CONSTANT_KM * body1.mass * body2.mass);
    dotr12 = dot(r12,r12);
    dotr21 = dot(r21, r21);
    unitr12 = unitVec(r12);
    unitr21 = unitVec(r21);
    for (var i = 0; i < 3; i++) {
        body1.currentForce[i] += unitr12[i] * gm1m2/(dotr12);
        body2.currentForce[i] += unitr21[i] * gm1m2/(dotr21);
    }
}

function updateAcceleration(body) 
{
    for (var i = 0; i < 3; i++){
        body.prevAcceleration[i] = body.acceleration[i];
        body.acceleration[i] = body.currentForce[i] / body.mass;
    }
    //body.prevAcceleration = body.acceleration;
    //body.acceleration = (body.currentForce).map(i => i / body.mass);
}

function updateVelocity(body)
{
    for (var i = 0; i < 3; i++) {
        //console.log(i);
        body.velocity[i] += body.acceleration[i]*timestep;
    }
    //body.velocity += body.acceleration.map(i => i * self.timestep);
}

function updatePosition(body)
{
    //console.log(body.velocity[0]);
    //body.position += (body.velocity.map(i => i * timestep));
    for (var i = 0; i < body.position.length; i++) { // < 3
        body.position[i] += (1/6)*(4*body.acceleration[i] - body.prevAcceleration[i])*(timestep**2) + body.velocity[i]*timestep;
    }
    //console.log(body);
}

function updateBodies(bodies) 
{
    //console.log(bodies[1]);
    for (var i = 0; i < bodies.length; i++) {
        //console.log(body);
        bodies[i].currentForce[0] = 0.0;
        bodies[i].currentForce[1] = 0.0;
        bodies[i].currentForce[2] = 0.0;
    }
    for (var i = 0; i < bodies.length; i++) {
        for (var j = i; j < bodies.length; j++) {
            if (j != i) {
                update2BodyForces(bodies[i], bodies[j]);
            }
        }
    }
    // now update each body's motion
    for (var i = 0; i < bodies.length; i++) {
       body = bodies[i];
       //console.log(body);
       updatePosition(body);
       
       updateVelocity(body);
       updateAcceleration(body);
    }
}

function getOrbitVelocity(body,radius) 
{
    //position_mag = np.sqrt(self.position.dot(self.position))
    return Math.sqrt((GRAV_CONSTANT_KM * body.mass) / radius);
    //tangUnitV = np.array([self.position[1]/position_mag, self.position[0]/position_mag],dtype=np.float64)
    //return [0,speed];
}