export default class Texture {
  constructor() {
    this.texture;
    this.isLoaded = false;
    this.filter = gl.NEAREST; // ou LINEAR affinage quand on scale par rapport à nearest mais des fois lignes blanches
  }

  setup(chemin) {
    this.texture = gl.createTexture();

    this.texture.image = new Image();
    this.texture.image.addEventListener('load', this.apply.bind(this), false);
    this.texture.image.src = chemin;
  }

  apply() {
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.texture.image);
    // FILTRE
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.filter);
    // REPETITION
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); // uv > 1 il repete 1
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT); // uv > 1 il repete la texture
    // MIPMAP
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR); // gl.LINEAR_MIPMAP_NEAREST
    //gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_LOD_BIAS, -0.4); // niveau de detail
    gl.bindTexture(gl.TEXTURE_2D, null);
    this.isLoaded = true;
  }

  setupDynamique() {
    var largeur = 64;
    var hauteur = 64;

    var b = new ArrayBuffer(largeur * hauteur * 4);
    var pixel = new Uint8Array(b);
    var cptRVBA = 0;

    for (var y = 0; y < hauteur; y++) {
      for (var x = 0; x < largeur; x++) {
        pixel[cptRVBA] = y % 255;
        pixel[cptRVBA + 1] = x % 255;
        pixel[cptRVBA + 2] = x % 255;
        pixel[cptRVBA + 3] = 255;
        cptRVBA += 4;
      }
    }

    this.texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, largeur, hauteur, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.bindTexture(gl.TEXTURE_2D, null);
    this.isLoaded = true;
  }

  setupNoise(taille) {
    if (taille == null) {
      taille = 4;
    }
    largeur = hauteur = taille;

    var b = new ArrayBuffer(largeur * hauteur);
    var pixel = new Uint8Array(b);
    var cpt = 0;

    for (var y = 0; y < hauteur; y++) {
      for (var x = 0; x < largeur; x++) {
        pixel[cpt] = random(0, 255);
        cpt++;
      }
    }

    this.texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.ALPHA,
      largeur,
      hauteur,
      0,
      gl.ALPHA,
      gl.UNSIGNED_BYTE,
      pixel,
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.bindTexture(gl.TEXTURE_2D, null);
    this.isLoaded = true;
  }

  setupOcclusionNoise(taille) {
    if (taille == null) {
      taille = 4;
    }
    largeur = hauteur = taille;

    var b = new ArrayBuffer(largeur * hauteur * 3);
    var pixel = new Uint8Array(b);
    var cptRVB = 0;

    for (var y = 0; y < hauteur; y++) {
      for (var x = 0; x < largeur; x++) {
        pixel[cptRVB] = random(-1, 1);
        pixel[cptRVB + 1] = random(-1, 1);
        pixel[cptRVB + 2] = 0;
        cptRVB += 3;
      }
    }

    this.texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, largeur, hauteur, 0, gl.RGB, gl.UNSIGNED_BYTE, pixel);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.bindTexture(gl.TEXTURE_2D, null);
    this.isLoaded = true;
  }

  setupPerlinNoise(taille) {
    this.texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.bindTexture(gl.TEXTURE_2D, null);

    this.updatePerlinNoise(taille, 0, 0);

    this.isLoaded = true;
  }

  updatePerlinNoise(taille, plusX, plusY) {
    if (taille == null) {
      taille = 64;
    }

    var b = new ArrayBuffer(taille * taille * 4);
    var pixel = new Uint8Array(b);
    var cptRVBA = 0;

    for (var y = plusY; y < taille + plusY; y++) {
      for (var x = plusX; x < taille + plusX; x++) {
        pixel[cptRVBA] = pixel[cptRVBA + 1] = pixel[cptRVBA + 2] = perlinNoise(x, y, 8) * 255;
        pixel[cptRVBA + 3] = 255;
        cptRVBA += 4;
      }
    }

    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, taille, taille, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
    gl.bindTexture(gl.TEXTURE_2D, null);
  }

  setupCube(chemin) {
    this.texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    var faces = [
      [chemin + '/posx.jpg', gl.TEXTURE_CUBE_MAP_POSITIVE_X],
      [chemin + '/negx.jpg', gl.TEXTURE_CUBE_MAP_NEGATIVE_X],
      [chemin + '/posy.jpg', gl.TEXTURE_CUBE_MAP_POSITIVE_Y],
      [chemin + '/negy.jpg', gl.TEXTURE_CUBE_MAP_NEGATIVE_Y],
      [chemin + '/posz.jpg', gl.TEXTURE_CUBE_MAP_POSITIVE_Z],
      [chemin + '/negz.jpg', gl.TEXTURE_CUBE_MAP_NEGATIVE_Z],
    ];

    for (var i = 0; i < faces.length; i++) {
      var face = faces[i][1];
      var image = new Image();
      //image.addEventListener("load", this.applyCubeSide(face, image), false);
      // image.onload(texture, face, image) {
      //   return function () {
      //     gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
      //     gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      //     gl.texImage2D(face, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      //   }
      // } (this.texture, face, image);
      // image.src = faces[i][0];
    }
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
    this.isLoaded = true;
  }

  get() {
    return this.texture;
  }
  isReady() {
    return this.isLoaded;
  }
  getWidth() {
    return this.texture.image.width;
  }
  getHeight() {
    return this.texture.image.height;
  }

  setFiltre(valeur) {
    this.filter = valeur;
  }
}
