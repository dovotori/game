import Perso from "./Perso"
import states from "../../../constants/sprites/monster"
import constants from "../../../constants/persos/monster"
import Behavior from "../Behaviors/BehaviorBackAndForth"

export default class extends Perso {
  constructor(viewBox, map) {
    super(states, viewBox, map)
  }

  setup() {
    this.behavior = new Behavior(constants)
  }

  update() {
    super.update()
    this.setStateFromBehavior()
  }

  setStateFromBehavior() {
    const speed = this.behavior.getSpeed()
    const isLanding = this.behavior.getCollision("landing")
    this.state.set("RUN")
    this.inverseX = speed[0] < 0
  }
}
