// handlingjavascript for displaying screen
// handles mouse dragging for moving the shape
// links slider values to the shader script

var sliderStart = document.getElementById("sliderStart");
var sliderParam1 = document.getElementById("sliderParam1");
var sliderParam2 = document.getElementById("sliderParam2");

var gl;
var canvas;
var shaderScript;
var shaderSource;
var vertexShader;
var fragmentShader;
var buffer;

var sphere_pos;
canvas        = document.getElementById('glscreen');
gl            = canvas.getContext('experimental-webgl');

canvas.width  = 800;
canvas.height = 800;
window.onload = init;



function init() {


  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

  buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
      -1.0,  1.0,
       1.0, -1.0,
       1.0,  1.0]),
    gl.STATIC_DRAW
  );


  shaderScript = document.getElementById("2d-vertex-shader");
  shaderSource = shaderScript.text;
  vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, shaderSource);
  gl.compileShader(vertexShader);

  shaderScript   = document.getElementById("2d-fragment-shader");
  shaderSource   = shaderScript.text;
  fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, shaderSource);
  gl.compileShader(fragmentShader);

  program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.useProgram(program);

  fractal_pos = gl.getUniformLocation(program,"fractal_pos");
  start = gl.getUniformLocation(program,"start");
  param1 = gl.getUniformLocation(program,"param1");
  param2 = gl.getUniformLocation(program,"param2");
  render();

}


/*================= Mouse events ======================*/


var THETA = 0.0,PHI = 0.0;
var AMORTIZATION = 0.8;
var drag = false;
var old_x, old_y;
var dX = 0, dY = 0;

var mouseDown = function(e) {
   drag = true;
   old_x = e.pageX, old_y = e.pageY;
   e.preventDefault();
   return false;
};

var mouseUp = function(e){
   drag = false;
};

var mouseMove = function(e) {
   if (!drag) return false;
   dX = (e.pageX-old_x)*2*Math.PI/canvas.width,
   dY = (e.pageY-old_y)*2*Math.PI/canvas.height;
   THETA+= dX;
   PHI+=dY;
   old_x = e.pageX, old_y = e.pageY;
   e.preventDefault();
};

canvas.addEventListener("mousedown", mouseDown, false);
canvas.addEventListener("mouseup", mouseUp, false);
canvas.addEventListener("mouseout", mouseUp, false);
canvas.addEventListener("mousemove", mouseMove, false);







function render() {

  if (!drag) {
     dX *= AMORTIZATION, dY*=AMORTIZATION;
     THETA+=dX, PHI+=dY;
  }

  window.requestAnimationFrame(render, canvas);
  console.log(sliderStart.value)
  gl.uniform3fv(fractal_pos,[THETA*1.0,-PHI*1.0,1.4])
  gl.uniform3fv(start,[0.0,0.0,sliderStart.value/100.0])
  gl.uniform1f(param1,sliderParam1.value/100.0)
  gl.uniform1f(param2,sliderParam2.value/10.0)

  gl.clearColor(1.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  positionLocation = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.TRIANGLES, 0, 6);



}








// ]]></script>
