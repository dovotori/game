import Behavior from "./BehaviorGravity"

export default class extends Behavior {
  constructor(constants) {
    super(constants)
    this.goLeft = false
  }
  updateSpeed() {
    super.updateSpeed()
    if (this.isCollision.right || this.isCollision.left) {
      this.goLeft = !this.goLeft
    }
    this.speed.addX((this.goLeft ? -1 : 1) * this.constants.run)
  }
}
