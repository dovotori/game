import Bullets from "./Bullets"
import Perso from "./Perso"
import Vec3 from "../geometrie/Vec3"

export default class extends Perso {
  constructor(viewBox, map) {
    super(viewBox, map)
    this.setRecoil = this.setRecoil.bind(this)
    this.bullets = new Bullets(viewBox, map, this.setRecoil)
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

  setRecoil(recoil) {
    this.behavior.addToSpeed(new Vec3(this.inverseX ? recoil : -recoil, 0, 0))
  }
}
