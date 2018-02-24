import Vec3 from "../geometrie/Vec3"

export default class {
  constructor() {
    this.position = new Vec3(0, 0, 0)
    this.speed = new Vec3(0, 0, 0)
    this.isLanding = false
    this.inverseSprite = false
    this.cornerLeft = true
  }

  setCollision(map) {
    this.isLanding = false
    this.updateSpeed()
    let newPosX = this.position.getX() + this.speed.getX()
    let newPosY = this.position.getY() + this.speed.getY()
    newPosX = this.collisionAxisX(map, newPosX)
    this.collisionAxisY(map, newPosX, newPosY)
  }

  updateSpeed() {}

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

  collisionAxisY(map, newPosX, newPosY) {
    if (this.speed.getY() < 0) {
      if (
        this.isCollisionTile(newPosX, newPosY, map) ||
        this.isCollisionTile(newPosX + 0.9, newPosY, map)
      ) {
        newPosY = Math.floor(newPosY) + 1
        this.speed.setY(0)
        this.isLanding = true
      }
    } else if (this.speed.getY() > 0) {
      if (
        this.isCollisionTile(newPosX, newPosY + 1, map) ||
        this.isCollisionTile(newPosX + 0.9, newPosY + 1, map)
      ) {
        newPosY = Math.floor(newPosY)
        this.speed.setY(0)
      }
    }
    this.position.set(newPosX, newPosY, this.position.getZ())
  }

  isCollisionTile(x, y, map) {
    const pixel = map.getImageData(Math.floor(x), Math.floor(y), 1, 1)
    return (
      pixel.data[0] !== 255 &&
      pixel.data[0] === pixel.data[1] &&
      pixel.data[1] === pixel.data[2]
    )
  }

  setPosition(x, y, z = 0) {
    return this.position.set(x, y, z)
  }

  getPosition() {
    return this.position.get()
  }

  getX() {
    return this.position.getX()
  }

  getY() {
    return this.position.getY()
  }

  getZ() {
    return this.position.getZ()
  }

  getSpeedX() {
    return this.speed.getX()
  }
}
