
const canvas = document.querySelector("#glCanvas");
const gl = canvas.getContext("webgl");

if (!gl) throw new Error('Oh no your browser does not support WebGL.');


var     left = false, right = false, up = false, down = false;

var programInfo;
var shader_program;
var buffers;

var game;

var rect = new Rectangle(gl, 0, 0, 1, 1);
var reference = new Rectangle(gl, 0, 0, 1, 1);

var cam_x = 0, cam_y = 0;


document.onkeydown = function (event) {    
    if (event.keyCode == 39)
        right = true;
    else if (event.keyCode == 37)
        left = true;
    else if (event.keyCode == 40)
        down = true;
    else if (event.keyCode == 38)
        up = true;
}

document.onkeyup = function (event) {
    if (event.keyCode == 39)
        right = false;
    else if (event.keyCode == 37)
        left = false;
    else if (event.keyCode == 40)
        down = false;
    else if (event.keyCode == 38)
        up = false;
    }


//
//      MAIN
//
function main()
{
    game = new Game(gl);
    //setup(game);
}


//
//      MAIN SETUP
//
async function setup()
{ 
    await game.load_shaders();
    shader_program = game.get_shader_by_id(1);
    programInfo = game.get_program_info(shader_program);

    rect.set_shader(programInfo);
    reference.set_shader(programInfo);

    buffers = init_square_buffers();

    requestAnimationFrame(thread);
    thread();
}

var x = y = 0;
var vel_x = vel_y = 0;
function thread()
{
    vel_x /= 1.3;
    vel_y /= 1.3;
    if (left)
        vel_x = -0.3;
    if (right)
        vel_x = 0.3;
    if (down)
        vel_y = -0.3;
    if (up)
        vel_y = 0.3;
    x += vel_x;
    y += vel_y;

    drawScene(programInfo, buffers, x, y); 
    requestAnimationFrame(thread);
}

//
//      MAIN LOOP
//
function update()
{

}

//
//      ERROR ON FETCH
//
function error(err)
{
    alert("Error: ", error);
}


//MATHUTIL
function lerp (value1, value2, amount)
{
    amount = amount < 0 ? 0 : amount;
    amount = amount > 1 ? 1 : amount;
    return value1 + (value2 - value1) * amount;
}


function drawScene(programInfo, buffers, x, y) {
    gl.clearColor(0.0, 0.0, 0.0, 0.4);  // Clear to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

    cam_x = lerp(cam_x, x, 0.3);
    cam_y = lerp(cam_y, y, 0.3);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    rect.draw(x, y);
    reference.draw(0, 0);
  }
  



function init_square_buffers() {

    // Create a buffer for the square's positions.
  
    const positionBuffer = gl.createBuffer();
  
    // Select the positionBuffer as the one to apply buffer
    // operations to from here out.
  
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  
    // Now create an array of positions for the square.
  
    const positions = [
       1.0,  1.0,
      -1.0,  1.0,
       1.0, -1.0,
      -1.0, -1.0,
    ];
  
    // Now pass the list of positions into WebGL to build the
    // shape. We do this by creating a Float32Array from the
    // JavaScript array, then use it to fill the current buffer.
  
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  
    // Now set up the colors for the vertices
  
    const colors = [
      1.0,  1.0,  1.0,  1.0,    // white
      1.0,  0.0,  0.0,  1.0,    // red
      0.0,  1.0,  0.0,  1.0,    // green
      0.0,  0.0,  1.0,  1.0,    // blue
    ];
  
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  
    return {
      position: positionBuffer,
      color: colorBuffer,
    };
  }

  main();









