import Dessin from "./Dessin"

export default class Context {
  constructor(canvas) {
    this.gl = canvas.getContext("webgl", {})

    this.gl.clearColor(0, 0, 0, 1)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)

    this.dessin = new Dessin(this.gl)
  }

  onResize(box) {
    this.gl.viewport(0, 0, box.width, box.height)
    this.dessin.onResize(box)
  }
}
