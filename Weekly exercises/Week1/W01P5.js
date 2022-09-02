window.onload = function init()
{
    canvas = document.getElementById("webgl");
    gl=WebGLUtils.setupWebGL(canvas);
    if (!gl){
        alert("WebGL isn't available");
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.3921, 0.5843, 0.9294, 1.0);

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Define points for the figure
    var r = 0.5;
    var n = 200;
    var vertices = new Array(); 
    var colors = new Array();
    var angle = 0; 
    

    for(var i = 0; i<= n; ++i ){
        angle = 2*Math.PI*i/n;
        vertices.push(vec2(r*Math.cos(angle), r*Math.sin(angle)));
        colors.push(vec3(1.0, 1.0, 1.0));
    }

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
    
    var vPosition = gl.getAttribLocation(program, "t_Position");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    // Define color for the amount of pints 
    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program, "t_Color");
    gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    //Jump on and off
    var bounce = false;
    var BounceButton = document.getElementById("BounceButton");
    BounceButton.addEventListener("click", function(ev){
        bounce = bounce==true ? bounce=false : bounce=true;
    });

    var betaLoc = gl.getUniformLocation(program, "beta"); 
    var beta = 0.0;
    stop_point = 1;

    function tick() {
      if (bounce){
        if(beta < -r){
          beta += 0.01
          stop_point *= -1
        }
        else if (beta > r){
          beta -= 0.01
          stop_point *= -1
        }
        else {
          beta += 0.01*stop_point
        }
        
      }
      gl.uniform1f(betaLoc, beta);
      render(gl, vertices.length); 
      requestAnimationFrame(tick); 
    }

  tick();
}

function render(gl, numPoints){
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, numPoints);
}