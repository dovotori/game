export default class Texture {
  constructor(gl, width = 4, height = 4) {
    this.gl = gl
    this.size = { width, height }
    this.texture = gl.createTexture()
    this.filter = gl.NEAREST // ou LINEAR affinage quand on scale par rapport à nearest mais des fois lignes blanches

    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture)
    this.setup()
    this.setupFilters()
    this.gl.bindTexture(this.gl.TEXTURE_2D, null)
  }

  setup() {
    const b = new ArrayBuffer(this.size.width * this.size.height)
    const pixels = new Uint8Array(b)
    let cpt = 0

    for (var y = 0; y < this.size.height; y++) {
      for (var x = 0; x < this.size.width; x++) {
        pixels[cpt] = Math.random() * 255
        cpt++
      }
    }

    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.ALPHA,
      this.size.width,
      this.size.height,
      0,
      this.gl.ALPHA,
      this.gl.UNSIGNED_BYTE,
      pixels,
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
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_WRAP_S,
      this.gl.REPEAT,
    )
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_WRAP_T,
      this.gl.REPEAT,
    )
  }

  get() {
    return this.texture
  }

  setFiltre(valeur) {
    this.filter = valeur
  }
}
