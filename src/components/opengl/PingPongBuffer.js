import Fbo from "./Fbo"

export default class PingPongBuffer {
  constructor(gl, width = 1024, height = 1024) {
    this.fbos = []
    this.currentFbo = 0
    this.fbos[0] = new Fbo(gl, width, height)
    this.fbos[1] = new Fbo(gl, width, height)
  }

  begin() {
    this.fbos[this.currentFbo].start()
  }

  end() {
    this.fbos[this.currentFbo].end()
  }

  swap() {
    if (this.currentFbo < 1) {
      this.currentFbo++
    } else {
      this.currentFbo = 0
    }
  }

  resize(box) {
    this.fbos[0].resize(box)
    this.fbos[1].resize(box)
  }

  getTexture() {
    return this.fbos[this.currentFbo].getTexture()
  }
  getDepthTexture() {
    return this.fbos[this.currentFbo].getDepthTexture()
  }
}
