import Vec3 from "../geometrie/Vec3"
import Mat4 from "../geometrie/Mat4"

export default class Camera {
  constructor() {
    this.position = new Vec3(0, 0, 4)
    this.cible = new Vec3(0, 0, 0)

    // MATRICES
    this.matIdentity = new Mat4()
    this.view = new Mat4()
    this.projection = new Mat4()

    this.far = 100.0
    this.near = 1.0

    this.angle = 50
    this.matIdentity.identity()
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

  perspective(w, h) {
    this.projection.identity()
    this.projection.perspective(this.angle, w / h, this.near, this.far)
  }

  setPosition(x, y, z) {
    this.position.set(x, y, z)
    this.lookAt()
  }
  setCible(x, y, z) {
    this.cible.set(x, y, z)
  }
  setNearFar(near, far) {
    this.near = near
    this.far = far
  }
  setAngle(value) {
    this.angle = value
  }

  getPosition() {
    return this.position
  }
  getCible() {
    return this.cible
  }
  getView() {
    return this.view.get()
  }
  getProjection() {
    return this.projection.get()
  }
  getMatriceIdentity() {
    return this.matIdentity.get()
  }
  getNearFar() {
    return [this.near, this.far]
  }
}
