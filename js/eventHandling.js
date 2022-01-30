// handling events dealing with resizing the window, and getting mouse coordinates and mouseDown boolean.

window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

//document.addEventListener('drag', onDocumentDrag, false);
var mouseScreenX = 0.0;
var mouseScreenY = 0.0;
document.onpointermove = function(event) {
    //console.log("pointer move");
    mouseScreenX = (event.clientX / window.innerWidth) * 2 - 1; // betewen -1 and 1?
    mouseScreenY = -(event.clientY / window.innerHeight) * 2 + 1;
}

var leftMouseDown = false;
var mouseDown = false;

document.onpointerdown = function(event) {
    switch ( event.button ) {
        case 0: console.log("Left Button is down."); 
            leftMouseDown = true;
            break;
        case 2: console.log("Right Button is down.");
            mouseDown = true;
            break;
    }
}
document.onpointerup = function(event) {
    switch ( event.button ) {
        case 0: console.log("Left Button is up."); 
            leftMouseDown = false;
            break;
        case 2: console.log("Right Button is up.");
            mouseDown = false;
            break;
    }
}