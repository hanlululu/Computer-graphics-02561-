window.onload = function init()
{
  canvas = document.getElementById("webgl");
  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    alert("WebGL isn’t available");
  }
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.3921, 0.5843, 0.9294, 1.0);
  //  Load shaders and initialize attribute buffers
  program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  var vertices = [
    vec2(0, 0.5),
    vec2(0.5, 0),
    vec2(-0.5, 0),
    vec2(0, -0.5)
  ];

  // vertex buffer
  var vertexbuffer = gl.createBuffer();
  // Bind appropriate array buffer to it
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexbuffer);
  // Pass the vertex data to the buffer
  gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  
  var colors = [
    vec3(1, 1, 1),
    vec3(1, 1, 1),
    vec3(1, 1, 1),
    vec3(1, 1, 1)
  ];

  // color buffer
  var colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

  var vColor = gl.getAttribLocation(program, "vColor");
  gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vColor);

  var ro = false; 
  var RotationButton = document.getElementById("RotationButton");
  RotationButton.addEventListener("click", function(ev){
      ro = ro==true ? ro=false : ro=true;
  });

  // Orbital angular velocity (Rotation)
  var thetaLoc = gl.getUniformLocation(program, "theta");
  var theta = 0.0;
  function tick() {
      if(ro){
          theta += 0.01; 
          gl.uniform1f(thetaLoc, theta);
      }
      render(gl, vertices.length); 
      requestAnimationFrame(tick);
  }
  tick();
}
function render(gl, numPoints){
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, numPoints);}
