import Dessin from "./Dessin"

export default class {
  constructor(canvas) {
    this.gl = this.checkWebGl(canvas)

    this.gl.enable(this.gl.DEPTH_TEST)
    this.gl.clearDepth(1.0)
    this.gl.depthFunc(this.gl.LESS)
    this.gl.enable(this.gl.CULL_FACE)
    this.gl.cullFace(this.gl.FRONT)
    this.gl.enable(this.gl.BLEND)
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA)

    this.gl.getExtension("WEBGL_depth_texture") ||
      this.gl.getExtension("MOZ_WEBGL_depth_texture") ||
      this.gl.getExtension("WEBKIT_WEBGL_depth_texture")

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
