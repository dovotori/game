import Bullet from "./Bullet"
import MeshSprite from "../opengl/MeshSprite"

export default class extends MeshSprite {
  constructor(gl) {
    super(gl)
    this.bullets = []
    this.isAiming = false
  }

  updateBullets(startPos, isAiming, goLeft, map) {
    if (!this.isAiming && isAiming) {
      this.createNewOne(goLeft)
    } else if (this.isAiming && !isAiming) {
      this.shootOne(goLeft)
    }
    let toDelete = []
    this.bullets.forEach((bullet, idx) => {
      const isCollision = bullet.setCollision(startPos, map)
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
      this.setTranslate(bullet.getX(), bullet.getY(), bullet.getZ())
      program.setTexture(0, texture.get())
      program.setBool("inverseX", bullet.getSpeedX() < 0 ? 1 : 0)
      this.setSprite(bullet.getState())
      super.render(objet, program)
    })
  }
}
