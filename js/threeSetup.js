// THREE.js setup stuff ---------------------------------------------

// setting up the window, camera, renderer, scene objects etc.
// any adjustments to controls can be made here
// includes handling mouse coord -> space coordinate, using THREE.Raycaster (used for creating a new body with right mouse click and drag)


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1e12 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


const controls = new THREE.OrbitControls( camera, renderer.domElement );
controls.mouseButtons = {
    LEFT: THREE.MOUSE.RIGHT,
    MIDDLE: THREE.MOUSE.MIDDLE,
    RIGHT: THREE.MOUSE.LEFT
}
controls.enableRotate = false;

var cameraCenterBodyIndex = -1;
camera.position.set(0.0, 0.0, 1.5e8);
camera.lookAt(0, 0, 0);
controls.update(); // need to call this after camera cheanged
console.log(controls.target);

var planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
var raycaster = new THREE.Raycaster();
function mouseCoordToZPlane(x, y) {
    var mv = new THREE.Vector3( x, y, 0.5);
    raycaster.setFromCamera(mv, camera);
    //ar raycaster = projector.pickingRay(mv, camera);
    //var intersections = raycaster.intersectObject(planeZ);
    var target = new THREE.Vector3(0, 0, 0);
    var intersection = raycaster.ray.intersectPlane(planeZ, target);
    //console.log(intersection.x);
    return [intersection.x, intersection.y, intersection.z];
}