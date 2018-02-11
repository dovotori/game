export default class {
  constructor() {
    this.cube = new Objet()
    this.cubeMap = new Texture()
    this.programTex = new Program()
    this.cpt = 0
    this.model = new Mat4()
  }

  setup() {
    this.cube.setupIndex(path + "objet/cube.obj")
    this.cubeMap.setupCube(path + "texture/space")
    this.programTex.setup(path + "shader/textureCube")
    this.model.identity()
  }

  draw(camera) {
    if (
      this.cube.isReady() &&
      this.cubeMap.isReady() &&
      this.programTex.isReady()
    ) {
      this.model.push()
      this.model.rotate(-this.cpt * 0.01, 0, 1, 0)
      this.model.scale(400, 400, 400)
      var normalmatrix = new Mat3()
      normalmatrix.set(this.model.getMatrice3x3())

      this.programTex.setMatrices(
        camera.getProjection().transpose(),
        this.model.transpose(),
        camera.getView().transpose(),
        normalmatrix.transpose(),
      )
      this.model.pop()

      this.programTex.setCubeTexture(this.cubeMap.get())

      this.cube.drawIndex(this.programTex.get())
    }
    this.cpt++
  }
}
