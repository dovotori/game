export default class Objet {
  constructor(gl) {
    this.gl = gl
    this.modeDessin = this.gl.TRIANGLES // gl.LINES // gl.TRIANGLES // gl.LINE_STRIP // gl.LINE_LOOP
    this.modeCalcul = this.gl.STATIC_DRAW // STATIC_DRAW -> change pas // DYNAMIC_DRAW -> repete // STREAM_DRAW -> une fois au moins

    this.objet = {
      position: { count: 0, vbo: null },
      texture: { count: 0, vbo: null },
    }
  }

  setPoints(points = [0, 0, 0, 0, 1, 0, 1, 0, 0], type) {
    this.objet[type] = { count: points.length, vbo: this.gl.createBuffer() }
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.objet[type].vbo)
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(points),
      this.modeCalcul,
    )
  }

  render(program) {
    this.gl.useProgram(program)
    this.gl.enableVertexAttribArray(program.vLoc)
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.objet.position.vbo)
    this.gl.vertexAttribPointer(
      program.locations.Position,
      3,
      this.gl.FLOAT,
      false,
      0,
      0,
    )
    this.gl.drawArrays(this.modeDessin, 0, this.objet.position.count / 3)
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
