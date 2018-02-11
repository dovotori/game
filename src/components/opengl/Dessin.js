import Scene from "./Scene"

export default class {
  constructor(gl) {
    this.fps = 1000 / 50
    this.lastFrame = new Date().getTime()
    this.gl = gl
    this.scene = new Scene(this.gl)

    this.render = this.render.bind(this)

    window.requestAnimationFrame(this.render)
  }

  onResize(box) {
    this.scene.onResize(box)
  }

  render() {
    const now = new Date().getTime()
    const milli = now - this.lastFrame

    if (milli > this.fps) {
      this.gl.clearColor(0.0, 0.0, 0.0, 1.0)
      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
      this.scene.render()
      this.lastFrame = now
    }
    window.requestAnimationFrame(this.render)
  }

  onMouseMove(infos) {
    this.scene.onMouseMove(infos)
  }

  onMouseDown(infos) {
    this.scene.onMouseDown(infos)
  }

  setDraggingInfos(infos) {
    this.scene.setDraggingInfos(infos)
  }
}
