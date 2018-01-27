import Dessin from "./Dessin"

export default class Context {
  constructor(canvas) {
    this.gl = this.checkWebGl(canvas)

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0)
    this.gl.clearDepth(1.0)
    this.gl.enable(this.gl.DEPTH_TEST)
    this.gl.depthFunc(this.gl.LEQUAL)

    this.dessin = new Dessin(this.gl)
  }

  checkWebGl(canvas) {
    const contexts = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"]
    let gl
    for (var i = 0; i < contexts.length; i++) {
      try {
        gl = canvas.getContext(contexts[i], { preserveDrawingBuffer: true })
      } catch (e) {
        console.log(e)
      }
      if (gl) {
        break
      }
    }
    return gl
  }

  onResize(box) {
    this.gl.viewport(0, 0, box.width, box.height)
    this.dessin.onResize(box)
  }

  onMouseMove(infos) {
    this.dessin.onMouseMove(infos)
  }

  onMouseDown(infos) {
    this.dessin.onMouseDown(infos)
  }

  setDraggingInfos(infos) {
    this.dessin.setDraggingInfos(infos)
  }
}
