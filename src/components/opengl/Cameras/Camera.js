import Vec3 from "../../geometry/Vec3"
import Mat4 from "../../geometry/Mat4"
import Spring from "../../geometry/Spring"

export default class {
  constructor(options) {
    this.position = new Vec3(
      options.position.x || 0,
      options.position.y || 0,
      options.position.z || 4,
    )
    this.target = new Vec3(
      options.target.x || 0,
      options.target.y || 0,
      options.target.z || 4,
    )

    // MATRICES
    this.matIdentity = new Mat4()
    this.view = new Mat4()
    this.projection = new Mat4()

    this.near = options.near || 1.0
    this.far = options.far || 100.0

    this.angle = options.angle || 50
    this.matIdentity.identity()
  }

  lookAt() {
    this.view.identity()
    this.view.lookAt(
      this.position.getX(),
      this.position.getY(),
      this.position.getZ(),
      this.target.getX(),
      this.target.getY(),
      this.target.getZ(),
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
    this.target.set(x, y, z)
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
    return this.target
  }
  getView() {
    return this.view
  }
  getProjection() {
    return this.projection
  }
  getIdentity() {
    return this.matIdentity
  }
  getNearFar() {
    return [this.near, this.far]
  }
}