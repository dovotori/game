import Behavior from "./Behavior"

export default class extends Behavior {
  constructor(constants) {
    super()
    this.constants = constants
    this.position.set(constants.x, constants.y, constants.z)
    this.statusSprite = "STAND"
  }

  updateSpeed() {
    if (Math.abs(this.speed.getX()) > 0.01) {
      this.speed.multiplyX(this.constants.damping)
    } else {
      this.speed.setX(0)
    }
    this.speed.addY(-this.constants.gravity)
    this.clamp()
  }

  clamp() {
    if (this.speed.getX() > this.constants.clamp.x)
      this.speed.setX(this.constants.clamp.x)
    if (this.speed.getX() < -this.constants.clamp.x)
      this.speed.setX(-this.constants.clamp.x)
    if (this.speed.getY() > this.constants.clamp.y)
      this.speed.setY(this.constants.clamp.y)
    if (this.speed.getY() < -this.constants.clamp.y)
      this.speed.setY(-this.constants.clamp.y)
  }
}
