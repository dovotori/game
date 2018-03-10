import Bullets from "../Bullets"
import Perso from "./Perso"
import Vec3 from "../../geometry/Vec3"
import Behavior from "../Behaviors/BehaviorInteraction"
import states from "../../../constants/sprites/heros"
import constants from "../../../constants/persos/heros"

export default class extends Perso {
  constructor(viewBox, map) {
    super(states, viewBox, map)

    this.setRecoil = this.setRecoil.bind(this)
    this.bullets = new Bullets(viewBox, map, this.setRecoil)
  }

  setup() {
    this.behavior = new Behavior(constants, this.updateState)
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

  updateState(name, inverse, corner) {
    this.inverseX = inverse
    this.cornerLeft = corner
    this.state.set(name)
  }

  setInteraction(interaction, changed) {
    this.behavior.setInteraction(interaction, changed)
  }

  setRecoil(recoil) {
    this.behavior.addToSpeed(new Vec3(this.inverseX ? recoil : -recoil, 0, 0))
  }

  getDashing() {
    return this.behavior.getDashing()
  }

  getAiming() {
    return this.behavior.getAiming()
  }
}
