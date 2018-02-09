export default class Objet {
  constructor(gl, obj) {
    this.gl = gl
    this.modeDessin = this.gl.TRIANGLES // gl.LINES // gl.TRIANGLES // gl.LINE_STRIP // gl.LINE_LOOP
    this.modeCalcul = this.gl.STATIC_DRAW // STATIC_DRAW -> change pas // DYNAMIC_DRAW -> repete // STREAM_DRAW -> une fois au moins

    this.steps = obj.steps

    this.stride = 0
    Object.entries(this.steps).forEach(step => {
      if (step[1] !== null) this.stride += step[1]
    })

    this.obj = {
      vbo: this.gl.createBuffer(),
      count: obj.points.length / this.stride,
    }

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.obj.vbo)
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(obj.points),
      this.modeCalcul,
    )
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null)
  }

  enable(program) {
    this.gl.useProgram(program)
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.obj.vbo)

    let decalage = 0
    Object.entries(this.steps).forEach(entry => {
      const [type, step] = entry
      if (program.locations[type] !== undefined) {
        this.gl.enableVertexAttribArray(program.locations[type])
        this.gl.vertexAttribPointer(
          program.locations[type],
          step,
          this.gl.FLOAT,
          false,
          this.stride * 4,
          decalage * 4,
        )
      }
      if (this.steps[type] !== null) decalage += this.steps[type]
    })
  }

  render(program) {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.obj.vbo)
    this.gl.drawArrays(this.modeDessin, 0, this.obj.count)
    this.end()
  }

  end() {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null)
    this.gl.useProgram(null)
  }

  setModeDessin(mode) {
    this.modeDessin = mode
  }

  setModeCalcul(mode) {
    this.modeCalcul = mode
  }
}
