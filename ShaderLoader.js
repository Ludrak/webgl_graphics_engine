

class ShaderLoader extends FileLoader
{
    constructor (gl, set_program_info)
    {
        super();
        this.gl = gl;
        this.shaders = [];
        this.shaderProgram = this.gl.createProgram();
        this.load = (vsfile, fsfile) =>
        {
            return new Promise(async (resolve, reject) => {
                try {
                    (this.read_file(vsfile, (src) => {this.shaders.push(this.loadShader(this.gl.VERTEX_SHADER, src));}));
                    (this.read_file(fsfile, (src) => {this.shaders.push(this.loadShader(this.gl.FRAGMENT_SHADER, src));}));
                    this.link_shaders();
                    await set_program_info(this.gl);
                    resolve(this.programInfo);
                } catch (ex) {
                    return reject(ex);
                }
                resolve(this);
            });
        };
        this.loadShader = (type, source) =>
        {
            const shader = this.gl.createShader(type);
            this.gl.shaderSource(shader, source);
            this.gl.compileShader(shader);
    
            if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) 
            {
                alert('An error occurred compiling the shaders: ' + this.gl.getShaderInfoLog(shader));
                this.gl.deleteShader(shader);
                return null;
            }
            return shader;
        };
    }

    link_shaders()
    {
        if (this.shaders && undefined !== this.shader)
        {
            for (var i = 0; i < this.shader.length; i++)
            {
                gl.attachShader(this.shaderProgram, shader[i]);
            }
            gl.linkProgram(this.shaderProgram);
            if (!this.gl.getProgramParameter(this.shaderProgram, this.gl.LINK_STATUS)) {
                alert('Unable to initialize the shader program: ' + this.gl.getProgramInfoLog(shaderProgram));
            }
        }
    }

    get_program_info ()
    {
        return (this.programInfo);
    }
}