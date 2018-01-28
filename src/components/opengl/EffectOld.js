export default class Effect {
  constructor() {
    this.ppb = new PingPongBuffer();
    this.screen = new Objet();

    this.programTex = new Program();
    this.fxaa = new Program();
    this.blurH = new Program();
    this.blurV = new Program();
    this.dof = new Program();
    this.debug = new Program();

    this.occlusion = new Occlusion();

    this.saveFbo = new Framebuffer();
  }

  setup(path) {
    var canvas = document.getElementById('canvas3d');
    var w = canvas.getAttribute('width');
    var h = canvas.getAttribute('height');

    this.ppb.setup(w, h);
    this.saveFbo.setup(w, h);
    this.programTex.setup(path + 'shader/basiqueFlat');
    this.fxaa.setup(path + 'shader/basiqueFlat', path + 'shader/fxaa');
    this.blurH.setup(path + 'shader/basiqueFlat', path + 'shader/blurHorizontal');
    this.blurV.setup(path + 'shader/basiqueFlat', path + 'shader/blurVertical');
    this.dof.setup(path + 'shader/basiqueFlat', path + 'shader/dof');
    this.debug.setup(path + 'shader/debugFlat', path + 'shader/depth');
    this.screen.setupFlat();

    this.occlusion.setup(path);
  }

  begin(camera, model) {
    this.ppb.begin();
  }
  end() {
    this.ppb.end();
  }

  beginSave(camera, model) {
    this.saveFbo.beginDraw();
  }
  endSave() {
    this.saveFbo.endDraw();
  }

  draw() {
    if (this.programTex.isReady() && this.screen.isReady()) {
      this.programTex.setTexture(this.ppb.getTexture());
      this.screen.draw(this.programTex.get());
    }
  }

  drawDebug() {
    if (this.programTex.isReady() && this.debug.isReady() && this.screen.isReady()) {
      this.debug.setTexture(this.ppb.getDepthTexture());
      this.screen.draw(this.debug.get());
    }
  }

  setDOF(nearFar, distance) {
    if (this.dof.isReady() && this.screen.isReady()) {
      this.dof.setBlurTexture(this.ppb.getTexture());
      this.ppb.swap();
      this.ppb.begin();
      this.dof.setDistanceDOF(distance);
      this.dof.setNearFar(nearFar);
      this.dof.setTexture(this.saveFbo.getTexture());
      this.dof.setDepthTexture(this.saveFbo.getDepthTexture());
      this.screen.draw(this.dof.get());
      this.ppb.end();
    }
  }

  setFXAA() {
    if (this.fxaa.isReady() && this.screen.isReady()) {
      this.fxaa.setTexture(this.ppb.getTexture());
      this.ppb.swap();
      this.ppb.begin();
      this.screen.draw(this.fxaa.get());
      this.ppb.end();
    }
  }

  setOcclusion(camera) {
    if (this.screen.isReady()) {
      this.occlusion.draw(camera, this.ppb.getTexture(), this.ppb.getDepthTexture());
      this.ppb.swap();
      this.ppb.begin();
      this.screen.draw(this.occlusion.getProgram());
      this.ppb.end();
    }
  }

  setBlur(nbPassages, blurDensite) {
    if (this.blurV.isReady() && this.blurH.isReady() && this.screen.isReady()) {
      this.blurH.setBlur(blurDensite);
      this.blurV.setBlur(blurDensite);

      for (var i = 0; i < nbPassages; i++) {
        this.blurH.setTexture(this.ppb.getTexture());
        this.ppb.swap();
        this.ppb.begin();
        this.screen.draw(this.blurH.get());
        this.ppb.end();

        this.blurV.setTexture(this.ppb.getTexture());
        this.ppb.swap();
        this.ppb.begin();
        this.screen.draw(this.blurV.get());
        this.ppb.end();
      }
    }
  }

  getTexture() {
    return this.ppb.getTexture();
  }

  setRayonOcclusion(value) {
    this.occlusion.setRayon(value);
  }
}

