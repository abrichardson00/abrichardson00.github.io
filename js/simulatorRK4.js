const GRAV_CONSTANT_KM = 6.67408e-20;//6.67408e-11;
var timestep = 1000;

function unitVec(r) {
    
    sq = r.map(i => i*i);
    mag = Math.sqrt(sq.reduce((a, b) => a + b, 0));
    return r.map(i => i / mag);
};

function subtractArray(a, b) {
    var c = new Array(3);
    for (var i = 0; i < 3; i++) {
        c[i] = a[i] - b[i];
    }
    return c;
}
function addArray(a, b) {
    var c = new Array(3);
    for (var i = 0; i < 3; i++) {
        c[i] = a[i] + b[i];
    }
    return c;
}
function multArray(a, value) {
    c = new Array(3);
    for (var i = 0; i < 3; i++) {
        c[i] = a[i]*value;
    }
    return c;
}
function elemwiseMultArray(a, b) {
    var c = new Array(3);
    for (var i = 0; i < 3; i++) {
        c[i] = a[i]*b[i];
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

function updateBodiesRK4(bodies) {
    var dvs = new Array(bodies.length);
    var drs = new Array(bodies.length);
    //var dv_k1 = acceleration(bodies[1].position, 1, bodies);


    // this for loop thing probably needs to change
    // first calculate all dv_k1s, dr_k1s for all bodies
    // then increment up to dv_k2s ... dv_k4s etc.

    dv_k1s = new Array(bodies.length);
    dr_k1s = new Array(bodies.length);
    for (var i = 0; i < bodies.length; i++) {
        dv_k1s[i] = acceleration(bodies[i].position, i, bodies);
        dr_k1s[i] = bodies[i].velocity;
    }

    dv_k2s = new Array(bodies.length);
    dr_k2s = new Array(bodies.length);
    for (var i = 0; i < bodies.length; i++) {
        dv_k2s[i] = acceleration(addArray(bodies[i].position, multArray(dr_k1s[i], (timestep / 2.0))), i, bodies);
        dr_k2s[i] = elemwiseMultArray(bodies[i].velocity, multArray(dv_k1s[i], (timestep / 2.0)));
    }

    // nah the accelerations functions needs changed too?????????????????????????????????

    
    for (var i = 0; i < bodies.length; i++) {
        
        // our k values for change in velocity and position
        
        var dv_k1 = [0.0, 0.0, 0.0];
        var dr_k1 = [0.0, 0.0, 0.0];
        var dv_k2 = [0.0, 0.0, 0.0];
        var dr_k2 = [0.0, 0.0, 0.0];
        var dv_k3 = [0.0, 0.0, 0.0];
        var dr_k3 = [0.0, 0.0, 0.0];
        var dv_k4 = [0.0, 0.0, 0.0];
        var dr_k4 = [0.0, 0.0, 0.0];
        
        //var dv_k1 = acceleration(bodies[i].position, 0, bodies);


        
        var dv_k1 = acceleration(bodies[i].position, i, bodies);
        var dr_k1 = bodies[i].velocity;
        //console.log(addArray(bodies[i].position, multArray(dr_k1, (timestep / 2.0))));
        /*
        var dv_k2 = acceleration(addArray(bodies[i].position, multArray(dr_k1, (timestep / 2.0))), i, bodies);
        var dr_k2 = elemwiseMultArray(bodies[i].velocity, multArray(dv_k1, (timestep / 2.0)));

        var dv_k3 = acceleration(addArray(bodies[i].position, multArray(dr_k2, (timestep / 2.0))), i, bodies);
        var dr_k3 = elemwiseMultArray(bodies[i].velocity, multArray(dv_k2, (timestep / 2.0)));

        var dv_k4 = acceleration(addArray(bodies[i].position, multArray(dr_k3, timestep)), i, bodies);
        var dr_k4 = elemwiseMultArray(bodies[i].velocity, multArray(dv_k3, timestep));
        */
        var dv_k2 = acceleration(addArray(bodies[i].position, multArray(dr_k1, (timestep / 2.0))), i, bodies);
        var dr_k2 = addArray(bodies[i].velocity, multArray(dv_k1, (timestep / 2.0)));

        var dv_k3 = acceleration(addArray(bodies[i].position, multArray(dr_k2, (timestep / 2.0))), i, bodies);
        var dr_k3 = addArray(bodies[i].velocity, multArray(dv_k2, (timestep / 2.0)));

        var dv_k4 = acceleration(addArray(bodies[i].position, multArray(dr_k3, timestep)), i, bodies);
        var dr_k4 = addArray(bodies[i].velocity, multArray(dv_k3, timestep));
       
        
        
        // now update velocity and position
        dvs[i] = [0.0, 0.0, 0.0];
        drs[i] = [0.0, 0.0, 0.0];
        for (var j = 0; j < 3; j++) {
            //console.log(dv_k1[j]);
            dvs[i][j] = ((timestep/6.0) * (dv_k1[j] + 2.0*dv_k2[j] + 2.0*dv_k3[j] + dv_k4[j]));
            drs[i][j] = ((timestep/6.0) * (dr_k1[j] + 2.0*dr_k2[j] + 2.0*dr_k3[j] + dr_k4[j]));
            //drs[i][j] = timestep * dr_k1[j];

            //dvs[i][j] = ((timestep/1.0) * (dv_k1[j]));// + 2*dv_k2[j])); //+ 2*dv_k3[j] + dv_k4[j]));
            //drs[i][j] = ((timestep/1.0) * (dr_k1[j]));// + 2*dr_k2[j])); //+ 2*dr_k3[j] + dr_k4[j]));
        }
        

        /*
        // Euler method: 
       var dv_k1 = acceleration(bodies[i].position, i, bodies);
       var dr_k1 = bodies[i].velocity;

       dvs[i] = [0.0, 0.0, 0.0];
       drs[i] = [0.0, 0.0, 0.0];
       for (var j = 0; j < 3; j++) {
            //console.log(dv_k1[j]);
            dvs[i][j] = timestep * dv_k1[j];
            drs[i][j] = timestep * dr_k1[j];
        }
        */
    }
    


    // once we've got all our changes in velocity and positions, now actually update all the body objects
    for (var i = 0; i < bodies.length; i++) {
        for (var j = 0; j < 3; j++) {
            //bodies[i].prevPosition[j] = bodies[i].position[j] // keep track of this to help with camera movement (fix to body position)
            bodies[i].dposition[j] = drs[i][j];
            bodies[i].velocity[j] += dvs[i][j];
            bodies[i].position[j] += drs[i][j];
        }
    }


    //*/
    
}

// we get multiple accelerations for the one body at different timesteps, but do we assume the other bodies stay still?
function acceleration(position, body_index, bodies) {
    //console.log(position);
    var newForce = [0.0, 0.0, 0.0];
    for (var i = 0; i < bodies.length; i++) {
        if (i != body_index) {
            var r12 = subtractArray(bodies[i].position, position);
            //r21 = subtractArray(position, bodies[i].position);
            // get force on body using some Newton law
            var gm1m2 = (GRAV_CONSTANT_KM * bodies[body_index].mass * bodies[i].mass);
            var dotr12 = dot(r12,r12);
            var unitr12 = unitVec(r12);
            for (var j = 0; j < 3; j++) {
                newForce[j] += unitr12[j] * gm1m2/dotr12;
            }
        }
    }
    newForce[0] = newForce[0] / bodies[body_index].mass;
    newForce[1] = newForce[1] / bodies[body_index].mass;
    newForce[2] = newForce[2] / bodies[body_index].mass;
    return newForce; // <- actually the acceleration, no point in creating a new array
}






function getOrbitVelocity(body,radius) {
    //position_mag = np.sqrt(self.position.dot(self.position))
    return Math.sqrt((GRAV_CONSTANT_KM * body.mass) / radius);
    //tangUnitV = np.array([self.position[1]/position_mag, self.position[0]/position_mag],dtype=np.float64)
    //return [0,speed];
}