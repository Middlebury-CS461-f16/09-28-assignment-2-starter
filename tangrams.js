let vertexShader = `
attribute vec4 a_Position;
uniform mat4 u_Transform;

void main(){

  gl_Position = u_Transform * a_Position;
}`;

let fragmentShader = `
precision mediump float;
uniform vec4 u_Color;
void main(){
  gl_FragColor = u_Color;
}`;

/*
This function handles all of the WebGL initialization and returns a "renderer" object with three functions:

drawTriangle(red, green, blue)
: This draw one triangle in the provided color, applying the "current matrix" as the transformation.

clear()
: This clears the screen (it just calls gl.clear())

currentMatrix(m)
: This returns the current matrix. Passing in a matrix as an argument sets the current matrix to something new.
*/
let initialize = function(){
  let canvas = document.getElementById('canvas');
  let gl;
  // catch the error from creating the context since this has nothing to do with the code
  try{
    gl = middUtils.initializeGL(canvas);
  } catch (e){
    alert('Could not create WebGL context');
    return;
  }

  // don't catch this error since any problem here is a programmer error
  let program = middUtils.initializeProgram(gl, vertexShader, fragmentShader);

  // create the triangle
  let vertices = new Float32Array([
    0.0, 1.0,
 	  0.0, 0.0,
 	  1.0, 0.0
  ]);

  // create the buffer and load it with the data
  let buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);


  // get the attribute for position
  let a_Position = gl.getAttribLocation(program, "a_Position");

  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0,0);
  gl.enableVertexAttribArray(a_Position);

  // get references to the two uniforms
  let u_Transform = gl.getUniformLocation(program, 'u_Transform');
  let u_Color= gl.getUniformLocation(program, 'u_Color');

  // set the current matrix to the identity
  let currentMatrix = new Float32Array([
    1,0,0,0,
    0,1,0,0,
    0,0,1,0,
    0,0,0,1
  ]);

  // set the clear color to black
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  return {
  drawTriangle: (red, green, blue) => {
    gl.uniform4f(u_Color, red, green, blue, 1);
    gl.uniformMatrix4fv(u_Transform, false, currentMatrix);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  },
  clear: () => {gl.clear(gl.COLOR_BUFFER_BIT )},
  currentMatrix: (m) => {
    if (m){
      currentMatrix = m;
    }
    return currentMatrix;
  }
  };
}


/*
This shows an example of the renderer at work.
*/

window.onload = function(){
  let renderer = initialize();

  renderer.clear();
  renderer.drawTriangle(1.0, 0.4, 0.4);


};
