export default class Framebuffer {
  constructor() {
    this.buffer;
    this.texture;
    this.depthTexture;
    this.isLoaded = false;
  }

  setup(width, height) {
    // frame buffer qui contient l'ecran
    this.buffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.buffer);
    this.buffer.width = width;
    this.buffer.height = height;

    // texture vide qui contiendra l'image de l'ecran
    this.texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      this.buffer.width,
      this.buffer.height,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      null,
    );

    // depth texture PAS DE SUPPORT SUR WEBGL
    this.depthTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.depthTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.DEPTH_COMPONENT,
      this.buffer.width,
      this.buffer.height,
      0,
      gl.DEPTH_COMPONENT,
      gl.UNSIGNED_SHORT,
      null,
    );

    // render buffer qui contient les infos couleurs pour la texture
    //var renderbuffer = gl.createRenderbuffer();
    //gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
    //gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.buffer.width, this.buffer.height);

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.buffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.DEPTH_ATTACHMENT,
      gl.TEXTURE_2D,
      this.depthTexture,
      0,
    );
    //gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);

    // remise a zero
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, null);
    //gl.bindRenderbuffer(gl.RENDERBUFFER, null);

    this.isLoaded = true;
  }

  beginDraw() {
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.buffer);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
  }

  endDraw() {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  switchDraw() {
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.buffer);
  }

  get() {
    return this.buffer;
  }
  getTexture() {
    return this.texture;
  }
  getDepthTexture() {
    return this.depthTexture;
  }
  isReady() {
    return this.isLoaded;
  }
}
