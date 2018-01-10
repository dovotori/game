import Scene from "./Scene"

export default class Dessin {
  constructor(gl) {
    this.fps = 1000 / 50
    this.lastFrame = new Date().getTime()
    this.gl = gl
    this.scene = new Scene(this.gl)

    this.render = this.render.bind(this)

    window.requestAnimationFrame(this.render)
  }

  render() {
    var now = new Date().getTime()
    var milli = now - this.lastFrame

    if (milli > this.fps) {
      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
      this.scene.render()
      this.lastFrame = now
    }
    window.requestAnimationFrame(this.render)
  }
}
