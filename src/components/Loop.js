export default class {
  constructor(callback) {
    this.callback = callback
    this.fps = 1000 / 50
    this.lastFrame = new Date().getTime()
    this.render = this.render.bind(this)
    window.requestAnimationFrame(this.render)
  }

  render() {
    const now = new Date().getTime()
    const milli = now - this.lastFrame

    if (milli > this.fps) {
      this.callback()
      this.lastFrame = now
    }
    window.requestAnimationFrame(this.render)
  }

  setCallback(callback) {
    this.callback = callback
  }

  setFps(fps) {
    this.fps = fps
  }
}
