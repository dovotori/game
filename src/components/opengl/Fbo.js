import TextureFbo from "./TextureFbo"
import TextureDepth from "./TextureDepth"

export default class Framebuffer {
  constructor(gl, width, height) {
    this.gl = gl
    this.buffer = this.gl.createFramebuffer()
    this.buffer.width = width
    this.buffer.height = height
    this.texture = new TextureFbo(
      this.gl,
      this.buffer.width,
      this.buffer.height,
    )
    // this.depthTexture = new TextureDepth(
    //   this.gl,
    //   this.buffer.width,
    //   this.buffer.height,
    // )

    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.buffer)
    this.setup()
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
  }

  setup() {
    this.gl.framebufferTexture2D(
      this.gl.FRAMEBUFFER,
      this.gl.COLOR_ATTACHMENT0,
      this.gl.TEXTURE_2D,
      this.texture.get(),
      0,
    )
    // this.gl.framebufferTexture2D(
    //   this.gl.FRAMEBUFFER,
    //   this.gl.DEPTH_ATTACHMENT,
    //   this.gl.TEXTURE_2D,
    //   this.depthTexture.get(),
    //   0,
    // )
  }

  start() {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.buffer)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
    this.gl.clearColor(0.0, 0.0, 0.0, 0.0)
  }

  end() {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
  }

  switch() {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.buffer)
  }

  get() {
    return this.buffer
  }
  getTexture() {
    return this.texture
  }
  getDepthTexture() {
    return this.depthTexture
  }
}
