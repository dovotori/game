import Bullets from "./Bullets"
import Perso from "./Perso"

export default class extends Perso {
  constructor(gl) {
    super(gl)
    this.bullets = new Bullets()
  }

  update(offset, map) {
    super.update(offset, map)
    this.bullets.updateBullets(
      this.position,
      this.behavior.getAiming(),
      this.inverseX,
      map,
    )
  }

  render(program, texture, objet) {
    super.render(program, texture, objet)
    this.bullets.render(program, texture, objet)
  }
}
