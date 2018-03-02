import Bullets from "./Bullets"
import Perso from "./Perso"

export default class extends Perso {
  constructor(viewBox, map) {
    super(viewBox, map)
    this.bullets = new Bullets(viewBox, map)
  }

  update() {
    super.update()
    this.bullets.updateBullets(
      this.behavior.getPosition(),
      this.behavior.getAiming(),
      this.inverseX,
    )
  }

  render(program, texture, objet) {
    super.render(program, texture, objet)
    this.bullets.render(program, texture, objet)
  }
}
