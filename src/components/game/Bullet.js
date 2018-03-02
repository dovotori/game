import Behavior from "./Behavior"
import StateSprite from "./StateSprite"
import states from "../../sprites/heros"

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
    let newPosX = this.position.getX() + this.speed.getX()
    newPosX = this.collisionAxisX(map, newPosX)

    this.position.set(newPosX, this.position.getY(), this.position.getZ())

    if (this.speed.getX() === 0) {
      return true
    }
    return false
  }

  collisionAxisX(map, newPosX) {
    if (this.speed.getX() < 0) {
      if (
        this.isCollisionTile(newPosX, this.position.getY(), map) ||
        this.isCollisionTile(newPosX, this.position.getY() + 0.9, map)
      ) {
        newPosX = Math.floor(newPosX) + 1
        this.speed.setX(0)
      }
    } else if (this.speed.getX() > 0) {
      if (
        this.isCollisionTile(newPosX + 1, this.position.getY(), map) ||
        this.isCollisionTile(newPosX + 1, this.position.getY() + 0.9, map)
      ) {
        newPosX = Math.floor(newPosX)
        this.speed.setX(0)
      }
    }
    return newPosX
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
