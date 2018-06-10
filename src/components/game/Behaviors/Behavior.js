import Vec3 from "../../geometry/Vec3"

export default class {
  constructor() {
    this.position = new Vec3(0, 0, 0)
    this.speed = new Vec3(0, 0, 0)
    this.size = new Vec3(1, 1, 1)
    this.inverseSprite = false
    this.cornerLeft = true
    this.spaceCheck = 0.000001 // for collision, remove a little space to check if perso is not yet on next tile
    this.tileSize = new Vec3(1, 1, 1)
    this.isCollision = {
      left: false,
      right: false,
      landing: false,
      top: false,
    }
  }

  setCollision(map) {
    this.isCollision.left = false
    this.isCollision.right = false
    this.isCollision.landing = false
    this.moving(this.speed.getX(), this.speed.getY(), map)
  }

  moving(speedX, speedY, map) {
    if (
      Math.abs(speedX) >= this.tileSize.getX() ||
      Math.abs(speedY) >= this.tileSize.getY()
    ) {
      const demiSpeedX = speedX / 2
      const demiSpeedY = speedY / 2
      this.moving(demiSpeedX, demiSpeedY, map)
      this.moving(demiSpeedX, demiSpeedY, map)
      return
    }
    let newPosX = this.collisionAxisX(map, speedX)
    let newPosY = this.collisionAxisY(map, newPosX, speedY)
    this.position.set(newPosX, newPosY, this.position.getZ())
  }

  collisionAxisX(map, speedX) {
    let newPosX = this.position.getX() + speedX
    if (speedX < 0) {
      if (
        this.isCollisionTile(newPosX, this.position.getY(), map) ||
        this.isCollisionTile(
          newPosX,
          this.position.getY() + (this.size.getY() - this.spaceCheck),
          map,
        )
      ) {
        newPosX = Math.floor(newPosX) + this.size.getX()
        this.isCollision.left = true
        this.speed.setX(0)
      }
    } else if (speedX > 0) {
      if (
        this.isCollisionTile(
          newPosX + this.size.getX(),
          this.position.getY(),
          map,
        ) ||
        this.isCollisionTile(
          newPosX + this.size.getX(),
          this.position.getY() + (this.size.getY() - this.spaceCheck),
          map,
        )
      ) {
        newPosX = Math.floor(newPosX)
        this.isCollision.right = true
        this.speed.setX(0)
      }
    }
    return newPosX
  }

  collisionAxisY(map, newPosX, speedY) {
    let newPosY = this.position.getY() + speedY
    if (speedY < 0) {
      if (
        this.isCollisionTile(newPosX, newPosY, map) ||
        this.isCollisionTile(
          newPosX + (this.size.getX() - this.spaceCheck),
          newPosY,
          map,
        )
      ) {
        newPosY = Math.floor(newPosY) + this.size.getY()
        this.speed.setY(0)
        this.isCollision.landing = true
      }
    } else if (speedY > 0) {
      if (
        this.isCollisionTile(newPosX, newPosY + this.size.getY(), map) ||
        this.isCollisionTile(
          newPosX + (this.size.getX() - this.spaceCheck),
          newPosY + this.size.getY(),
          map,
        )
      ) {
        newPosY = Math.floor(newPosY)
        this.speed.setY(0)
      }
    }
    return newPosY
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

  getSpeed() {
    return this.speed.get()
  }

  getSpeedX() {
    return this.speed.getX()
  }

  getSpeedY() {
    return this.speed.getY()
  }

  addToSpeed(add) {
    this.speed.add(add)
  }

  getCollision(direction) {
    return this.isCollision[direction]
  }
}
