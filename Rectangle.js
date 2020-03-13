
class Rectangle
{
    constructor (gl, x, y, sx, sy)
    {
        this.gl = gl;
        this.positionBuffer = this.gl.createBuffer();
  
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);

        sx /= 2;
        sy /= 2;
        const positions = [
            sx,  sy,
            -sx,  sy,
            sx, -sy,
            -sx, -sy,
        ];

        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW);

        const colors = [
        1.0,  1.0,  1.0,  1.0,    // white
        1.0,  0.0,  1.0,  1.0,    // red
        1.0,  1.0,  1.0,  1.0,    // green
        1.0,  1.0,  1.0,  1.0,    // blue
        ];
  
        this.colorBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.STATIC_DRAW);

        this.position = {
            x: x,
            y: y,
        }
    }

    draw(x, y)
    {
        const fieldOfView = 45 * Math.PI / 180;   // in radians
        const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        const zNear = 0.1;
        const zFar = 100.0;
        this.projectionMatrix = mat4.create();
    
        // note: glmatrix.js always has the first argument
        // as the destination to receive the result.
        mat4.perspective(this.projectionMatrix,
                        fieldOfView,
                        aspect,
                        zNear,
                        zFar);
    
        this.modelViewMatrix = mat4.create();
    
        mat4.translate(this.modelViewMatrix,     // destination matrix
            this.modelViewMatrix,     // matrix to translate
                    [x, y, -20.0]);  // amount to translate
  

        this.set_shader_attrib();
        this.gl.useProgram(this.programInfo.program);
        this.set_shader_uniforms();


        {
            const offset = 0;
            const vertexCount = 4;
            this.gl.drawArrays(this.gl.TRIANGLE_STRIP, offset, vertexCount);
        }
    }

    set_shader_attrib()
    {
        {
            const numComponents = 2;
            const type = this.gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
            this.gl.vertexAttribPointer(
                this.programInfo.attribLocations.vertexPosition,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            this.gl.enableVertexAttribArray(
                this.programInfo.attribLocations.vertexPosition);
          }
        
          // Tell WebGL how to pull out the colors from the color buffer
          // into the vertexColor attribute.
          {
            const numComponents = 4;
            const type = this.gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
            this.gl.vertexAttribPointer(
                this.programInfo.attribLocations.vertexColor,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            this.gl.enableVertexAttribArray(
                this.programInfo.attribLocations.vertexColor);
          }
    }

    set_shader(shader)
    {
        this.programInfo = shader;
    }

    set_shader_uniforms()
    {
        this.gl.uniformMatrix4fv(
            this.programInfo.uniformLocations.projectionMatrix,
            false,
            this.projectionMatrix);
        this.gl.uniformMatrix4fv(
            this.programInfo.uniformLocations.modelViewMatrix,
            false,
            this.modelViewMatrix);
    }
}