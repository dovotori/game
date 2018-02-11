import Texture from "./Texture"

export default class extends Texture {
  create() {
    const b = new ArrayBuffer(this.size.width * this.size.height * 4)
    const pixels = new Uint8Array(b)
    let cptRVBA = 0

    for (var y = 0; y < this.size.height; y++) {
      for (var x = 0; x < this.size.width; x++) {
        pixels[cptRVBA] = Math.random() * 255
        pixels[cptRVBA + 1] = Math.random() * 255
        pixels[cptRVBA + 2] = Math.random() * 255
        pixels[cptRVBA + 3] = 255
        cptRVBA += 4
      }
    }

    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.RGBA,
      this.size.height,
      this.size.width,
      0,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      pixels,
    )
  }
}
