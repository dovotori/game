export default class {
  constructor() {
    this.fbo = new Framebuffer()
    this.eau = new Objet()
    this.programEau = new Program()
    this.model = new Mat4()
    this.niveauEau = 0
    this.cpt = 0
  }

  setup(width, height) {
    this.fbo.setup(width, height)
    this.eau.setupFlat()
    this.programEau.setup(path + "shader/eau")
    this.model.identity()
  }

  beginDraw() {
    this.fbo.beginDraw()
  }
  endDraw() {
    this.fbo.endDraw()
  }

  draw(camera) {
    if (this.eau.isReady() && this.programEau.isReady()) {
      this.model.push()
      this.model.translate(128, this.niveauEau, 128)
      this.model.scale(128, 128, 128)
      this.model.rotate(90, 1, 0, 0)
      this.programEau.setMatrices(
        camera.getProjection().transpose(),
        this.model.transpose(),
        camera.getView().transpose(),
      )
      this.model.pop()
      this.programEau.setOpacity(0.6)
      this.programEau.setTexture(this.fbo.getTexture())
      this.programEau.setWave(this.cpt, Math.cos(this.cpt * 0.001))
      this.eau.draw(this.programEau.get())
    }
    this.cpt++
  }

  getNiveau() {
    return this.niveauEau
  }
}
