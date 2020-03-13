
class Game extends Environement
{
    constructor(gl)
    {
        super(gl);
    }

    async load_shaders () 
    {
        await this.load_shader(1, "shader.vs", "shader.fs");
    }
}