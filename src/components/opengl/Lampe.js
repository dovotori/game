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
    this.view.identity()
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
      this.position.x + Math.cos(time * 0.1) * 0.1,
      this.position.y + Math.sin(time * 0.1) * 0.1,
      this.position.z,
      // 10,
      // 10,
      // 10,
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
  getCible() {
    return this.cible.get()
  }

  setPosition(x, y, z) {
    this.position.set(x, y, z)
    this.lookAt()
  }
  setCible(x, y, z) {
    this.cible.set(x, y, z)
  }
  setCibleVec3(Vec3) {
    this.cible.egale(Vec3)
  }
}
