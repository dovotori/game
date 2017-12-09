export default class Lampe {
  constructor() {
    this.fbo = new Framebuffer();
    this.position = new Vec3(0, 0, 4);
    this.cible = new Vec3(0, 0, 0);
    this.view = new Mat4();
  }

  setup(width, height) {
    this.fbo.setup(width, height);
    this.lookAt();
  }

  lookAt() {
    this.view.identity();
    this.view.lookAt(
      this.position.x,
      this.position.y,
      this.position.z,
      this.cible.x,
      this.cible.y,
      this.cible.z,
      0,
      1,
      0,
    );
  }

  beginDraw() {
    gl.cullFace(gl.FRONT); // supprime le peter paning
    this.fbo.beginDraw();
  }
  endDraw() {
    this.fbo.endDraw();
    gl.cullFace(gl.BACK);
  }

  getDepthTexture() {
    return this.fbo.getDepthTexture();
  }
  getViewMatrix() {
    return this.view;
  }
  getPosition() {
    return this.position;
  }
  getCible() {
    return this.cible;
  }

  setPosition(x, y, z) {
    this.position.set(x, y, z);
    this.lookAt();
  }
  setCible(x, y, z) {
    this.cible.set(x, y, z);
  }
  setCibleVec3(Vec3) {
    this.cible.egale(Vec3);
  }
}
