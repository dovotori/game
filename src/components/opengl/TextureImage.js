import Texture from "./Texture"

export default class TextureImage extends Texture {
  constructor(gl, image) {
    this.gl = gl
    this.texture = gl.createTexture()
    this.texture.image = image
    this.filter = gl.NEAREST

    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture)
    this.setup()
    this.setupFilters()
    this.gl.bindTexture(this.gl.TEXTURE_2D, null)
  }

  setup() {
    this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true)
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.RGBA,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      this.texture.image,
    )
  }

  setupFilters() {
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MAG_FILTER,
      this.filter,
    )
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MIN_FILTER,
      this.filter,
    )
    // REPETITION
    //this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    //this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE); // uv > 1 il repete 1
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_WRAP_S,
      this.gl.REPEAT,
    )
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_WRAP_T,
      this.gl.REPEAT,
    ) // uv > 1 il repete la texture
    // MIPMAP
    this.gl.generateMipmap(this.gl.TEXTURE_2D)
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MIN_FILTER,
      this.gl.LINEAR_MIPMAP_LINEAR,
    ) // this.gl.LINEAR_MIPMAP_NEAREST
    //this.gl.texParameterf(this.gl.TEXTURE_2D, this.gl.TEXTURE_LOD_BIAS, -0.4); // niveau de detail
  }
}
