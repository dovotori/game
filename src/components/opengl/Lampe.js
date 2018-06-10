import Fbo from "./Fbo"
import MeshRepere from "./Meshes/MeshRepere"
import Vec3 from "../geometry/Vec3"
import Mat4 from "../geometry/Mat4"

export default class {
  constructor(gl, config, width = 1024, height = 1024) {
    this.gl = gl
    this.fbo = new Fbo(this.gl, width, height)
    this.position = new Vec3(
      config.position.x,
      config.position.y,
      config.position.z,
    )
    this.cible = new Vec3(0, 0, 0)
    this.view = new Mat4()
    this.repere = new MeshRepere(this.gl)
    this.cpt = 0
    this.lookAt()
  }

  lookAt() {
    this.view
      .identity()
      .lookAt(
        this.position.getX(),
        this.position.getY(),
        this.position.getZ(),
        this.cible.getX(),
        this.cible.getY(),
        this.cible.getZ(),
        0,
        1,
        0,
      )
  }

  start() {
    this.gl.cullFace(this.gl.FRONT) // supprime le peter paning
    this.fbo.start()
  }

  end() {
    this.fbo.end()
    this.gl.cullFace(this.gl.BACK)
  }

  updateRandomPosition(time) {
    this.position.set(
      10 + Math.cos(time * 0.01) * 6,
      10 + Math.sin(time * 0.01) * 6,
      this.position.getZ(),
    )
    this.repere.update(this.position)
  }

  renderRepere(camera) {
    this.repere.render(camera)
  }

  getDepthTexture() {
    return this.fbo.getDepthTexture()
  }
  getViewMatrix() {
    return this.view
  }
  getPosition() {
    return this.position.get()
  }
  getPositionVec3() {
    return this.position
  }
  getCible() {
    return this.cible.get()
  }
  getModel() {
    return this.repere.getModel()
  }

  setPosition(x, y, z) {
    this.position.set(x, y, z)
    this.lookAt()
  }
  setCible(x, y, z) {
    this.cible.set(x, y, z)
  }
  setCibleVec3(Vec3) {
    this.cible.equal(Vec3)
  }
}
