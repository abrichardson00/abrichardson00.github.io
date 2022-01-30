class Body {
    constructor(name, r, c, m, p, v) {
        this.name = name;
        this.radius = r;
        this.colour = c;
        this.mass = m;
        this.position = p;
        //this.prevPosition = p;
        this.dposition = [0.0, 0.0, 0.0];
        this.velocity = v;
        this.acceleration = [0.0, 0.0, 0.0]; // initialize acceleration and force vectors
        this.prevAcceleration = [0.0, 0.0, 0.0];
        //const f = new Array(0.0, 0.0, 0.0);
        this.currentForce = [0.0, 0.0, 0.0];
    }

    
}