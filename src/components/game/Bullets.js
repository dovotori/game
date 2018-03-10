import Bullet from "./Bullet"
import MeshSprite from "../opengl/Meshes/MeshSprite"

export default class extends MeshSprite {
  constructor(viewBox, map, callbackShoot) {
    super()
    this.bullets = []
    this.isAiming = false
    this.viewBox = viewBox
    this.map = map
    this.callbackShoot = callbackShoot
    this.recoil = 0.1
  }

  updateBullets(startPos, isAiming, goLeft) {
    if (!this.isAiming && isAiming) {
      this.createNewOne(goLeft)
    } else if (this.isAiming && !isAiming) {
      this.shootOne(goLeft)
      if (this.callbackShoot) this.callbackShoot(this.recoil)
    }
    let toDelete = []
    this.bullets.forEach((bullet, idx) => {
      const isCollision = bullet.setCollision(startPos, this.map)
      if (isCollision) {
        toDelete.push(idx)
      }
    })

    if (toDelete.length > 0) {
      this.bullets = this.bullets.filter(
        (bullet, idx) => toDelete.indexOf(idx) === -1,
      )
    }

    this.isAiming = isAiming
  }

  createNewOne(goLeft) {
    this.bullets.push(new Bullet(goLeft))
  }

  shootOne(goLeft) {
    if (this.bullets.length > 0) {
      this.bullets[this.bullets.length - 1].shoot(goLeft)
    }
  }

  render(program, texture, objet) {
    this.bullets.forEach(bullet => {
      this.reset()
      this.setTranslate(
        bullet.getX() - this.viewBox.x,
        bullet.getY() - this.viewBox.y,
        bullet.getZ(),
      )
      program.setTexture(0, texture.get())
      program.setBool("inverseX", bullet.getSpeedX() < 0 ? 1 : 0)
      this.setSprite(bullet.getState())
      super.render(objet, program)
    })
  }
}
