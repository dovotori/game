export default class Texture {
  constructor(gl, image = null) {
    this.gl = gl
    this.texture = gl.createTexture()
    this.filter = gl.NEAREST // ou LINEAR affinage quand on scale par rapport à nearest mais des fois lignes blanches
    if (image !== null) {
      this.texture.image = image
      this.setupImage()
    } else {
      this.setupNoise()
    }
  }

  setupImage() {
    gl.bindTexture(gl.TEXTURE_2D, this.texture)
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      this.texture.image,
    )
    // FILTRE
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.filter)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.filter)
    // REPETITION
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); // uv > 1 il repete 1
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT) // uv > 1 il repete la texture
    // MIPMAP
    gl.generateMipmap(gl.TEXTURE_2D)
    gl.texParameteri(
      gl.TEXTURE_2D,
      gl.TEXTURE_MIN_FILTER,
      gl.LINEAR_MIPMAP_LINEAR,
    ) // gl.LINEAR_MIPMAP_NEAREST
    //gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_LOD_BIAS, -0.4); // niveau de detail
    gl.bindTexture(gl.TEXTURE_2D, null)
  }

  setupNoise(taille = 4) {
    const largeur = taille
    const hauteur = taille
    var b = new ArrayBuffer(largeur * hauteur)
    var pixel = new Uint8Array(b)
    var cpt = 0

    for (var y = 0; y < hauteur; y++) {
      for (var x = 0; x < largeur; x++) {
        pixel[cpt] = Math.random() * 255
        cpt++
      }
    }

    this.texture = this.gl.createTexture()
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture)
    //this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.ALPHA,
      largeur,
      hauteur,
      0,
      this.gl.ALPHA,
      this.gl.UNSIGNED_BYTE,
      pixel,
    )
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
    this.gl.bindTexture(this.gl.TEXTURE_2D, null)
  }

  get() {
    return this.texture
  }
  getWidth() {
    return this.texture.image.width
  }
  getHeight() {
    return this.texture.image.height
  }
  setFiltre(valeur) {
    this.filter = valeur
  }
}
