export default class Program {
  constructor(gl, config) {
    this.gl = gl
    this.config = config
    this.program = this.gl.createProgram()

    this.setup()
  }

  setup() {
    this.creerShader("vertex", this.config.vertex)
    this.creerShader("fragment", this.config.fragment)
    this.gl.linkProgram(this.program)
    this.gl.useProgram(this.program)
    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
      console.log("Erreur: ne peux pas lier le shader au program")
      this.gl.deleteProgram(this.program)
      return
    }
    this.createLocations()
    this.gl.useProgram(null)
  }

  creerShader(type, source) {
    var shader = this.gl.createShader(
      type == "vertex" ? this.gl.VERTEX_SHADER : this.gl.FRAGMENT_SHADER,
    )
    this.gl.shaderSource(shader, source)
    this.gl.compileShader(shader)

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.log(
        `Peux pas compiler ${type} shader: ${this.gl.getShaderInfoLog(shader)}`,
      )
      this.gl.deleteShader(shader)
      return
    }
    this.gl.attachShader(this.program, shader)
    this.gl.deleteShader(shader)
  }

  createLocations() {
    this.program.locations = {}
    this.config.uniforms.forEach(
      uniform =>
        (this.program.locations[uniform] = this.gl.getUniformLocation(
          this.program,
          uniform,
        )),
    )
    this.config.attributes.forEach(
      attribute =>
        (this.program.locations[attribute] = this.gl.getAttribLocation(
          this.program,
          attribute,
        )),
    )
  }

  setMatrix(location, matrix) {
    this.gl.useProgram(this.program)
    this.gl.uniformMatrix4fv(this.program.locations[location], false, matrix)
    this.gl.useProgram(null)
  }

  setBool(location, bool) {
    this.gl.useProgram(this.program)
    this.gl.uniform1i(this.program.locations[location], bool)
    this.gl.useProgram(null)
  }

  setTexture(location, texture, idx) {
    this.gl.useProgram(this.program)
    switch (idx) {
      default:
      case 0:
        this.gl.activeTexture(this.gl.TEXTURE0)
        break
      case 1:
        this.gl.activeTexture(this.gl.TEXTURE1)
        break
      case 2:
        this.gl.activeTexture(this.gl.TEXTURE2)
        break
      case 3:
        this.gl.activeTexture(this.gl.TEXTURE3)
        break
      case 4:
        this.gl.activeTexture(this.gl.TEXTURE4)
        break
    }
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture)
    this.gl.uniform1i(this.program.locations[location], idx)
    this.gl.useProgram(null)
  }

  setVector(location, value) {
    this.gl.useProgram(this.program)
    switch (value.length) {
      default:
      case 2:
        this.gl.uniform2fv(this.program.locations[location], value)
        break
      case 3:
        this.gl.uniform3fv(this.program.locations[location], value)
        break
      case 4:
        this.gl.uniform4fv(this.program.locations[location], value)
        break
    }
    this.gl.useProgram(null)
  }

  enable() {
    this.gl.useProgram(this.program)
  }

  disable() {
    this.gl.useProgram(null)
  }

  get() {
    return this.program
  }
}
