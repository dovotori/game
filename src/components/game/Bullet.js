import Behavior from "./Behaviors/Behavior"
import StateSprite from "./StateSprite"
import states from "../../constants/sprites/heros"

export default class extends Behavior {
  constructor(goLeft) {
    super()
    this.isAiming = true
    this.goLeft = goLeft
    this.offset = {
      x: 0.7,
      y: 0.2,
    }
    this.state = new StateSprite(states)
    this.state.set("BULLET_LOAD")
  }

  setCollision(pos, map) {
    if (this.isAiming) {
      const x = this.goLeft ? pos[0] - this.offset.x : pos[0] + this.offset.x
      this.position.set(x, pos[1] + this.offset.y, 0.2)
      return false
    }
    this.moving(this.speed.getX(), map)
    return this.speed.getX() === 0
  }

  moving(speedX, map) {
    if (Math.abs(speedX) >= this.tileSize.getX()) {
      const demiSpeedX = speedX / 2
      this.moving(demiSpeedX, map)
      this.moving(demiSpeedX, map)
      return
    }
    let newPosX = this.collisionAxisX(map, speedX)
    this.position.set(newPosX, this.position.getY(), this.position.getZ())
  }

  shoot(goLeft) {
    if (this.isAiming) {
      this.isAiming = false
      this.speed.setX(goLeft ? -1 : 1)
      this.state.set("BULLET")
    }
  }

  getState() {
    return this.state.get()
  }
}
