class Environement
{
    constructor (gl)
    {
        this.gl = gl;
        this.shaders = [];
        this.shader_queue = [];
    }

    /**
     * COMPILES A SHADER DEPENDING OF ITS TYPE
     * @param {*} source    The source code written in GLSL
     * @param {*} type      The type of the shader (vertex or fragment)
     */
    compile_shader (source, type)
    {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) 
        {
            console.log('An error occurred compiling the shaders: ' + this.gl.getShaderInfoLog(shader));
            this.gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    /**
     * ATTACH AND LINK SHADER FILES TO PROGRAM
     * @param {*} vs        The vertex_shader
     * @param {*} fs        The fragment_shader
     * @param {*} program   The shader program to link to
     */
    link_shaders (vs, fs, program)
    {
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);

        gl.linkProgram(program);
        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            console.log('Unable to initialize the shader program: ' + this.gl.getProgramInfoLog(program));
        }
    }

    /**
     * LOADS A SHADER USING VERTEX AND FRAGMENT FILENAMES
     * @param {*} id            The id of the Shader
     * @param {*} vertex_file   The filename for the vertex_shader
     * @param {*} fragment_file The filename for the fragment_shader
     */
    async load_shader (id, vertex_file, fragment_file)
    {
        return Promise.all([fetch(vertex_file), fetch(fragment_file)])
        .then((shaders) => Promise.all(shaders.map((shader) => shader.text())))
        .then((texts) => new Promise((res) => {
            var shader_program = gl.createProgram();

            var vs = this.compile_shader(texts[0], gl.VERTEX_SHADER);
            var fs = this.compile_shader(texts[1], gl.FRAGMENT_SHADER);
            this.link_shaders(vs, fs, shader_program);

            this.shaders.push ({
                program:    shader_program,
                id:         id,
            });
            res(id);
        }));
    }

    /**
     * RETURNS THE PREVIOUSLY LOADED SHADER WITH THE GIVEN ID
     * @param {*} id    ID of the shader
     */
    get_shader_by_id(id)
    {
        for (var i = 0; i < this.shaders.length; i++)
        {
            if (this.shaders[i].id == id)
            {
                console.log("Charged shader of id : ", id);
                return (this.shaders[i].program);
            }
        }
        console.log("Error : Unable to load shader of ID : ", id);
        return (null);
    }

    get_program_info (s)
    {
        if (s == null)
            return ;
        this.programInfo = {
            program: s,
            attribLocations: {
              vertexPosition: gl.getAttribLocation(s, 'aVertexPosition'),
              vertexColor: gl.getAttribLocation(s, 'aVertexColor'),
            },
            uniformLocations: {
              projectionMatrix: gl.getUniformLocation(s, 'uProjectionMatrix'),
              modelViewMatrix: gl.getUniformLocation(s, 'uModelViewMatrix'),
            },
        };
        return (this.programInfo);   
    }

    /**
     * NEED TO BE OVERWRITTEN IN CHILD  => LOADS YOUR SHADERS HERE USING load_shader().
     */
    async load_shaders() { }
}