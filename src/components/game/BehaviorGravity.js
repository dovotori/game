import Behavior from "./Behavior"

export default class extends Behavior {
  constructor(constants) {
    super()
    this.constants = constants
    this.position.set(constants.x, constants.y, 0.1)
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
    if (this.speed.getX() > 1) this.speed.setX(1)
    if (this.speed.getX() < -1) this.speed.setX(-1)
    if (this.speed.getY() > 1) this.speed.setY(1)
    if (this.speed.getY() < -1) this.speed.setY(-1)
  }
}
