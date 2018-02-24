import StateSprite from "./StateSprite"
import MeshSprite from "../opengl/MeshSprite"
import states from "../../sprites/heros"
import constants from "../../persos/heros"
import Behavior from "./BehaviorInteraction"

export default class extends MeshSprite {
  constructor(gl) {
    super(gl)
    this.inverseX = false
    this.cornerLeft = false
    this.position = [constants.x || 0, constants.y || 0]

    this.updateState = this.updateState.bind(this)
    this.setEndOfAnimation = this.setEndOfAnimation.bind(this)

    this.behavior = new Behavior(constants, this.updateState)
    this.state = new StateSprite(states, this.setEndOfAnimation)
    this.state.set("STAND")
  }

  render(program, texture, objet) {
    this.model.translate(
      this.position[0],
      this.position[1],
      this.behavior.getZ(),
    )
    program.setTexture(0, texture.get())
    program.setBool("inverseX", this.inverseX ? 1 : 0)
    program.setBool("cornerLeft", this.cornerLeft ? 1 : 0)
    this.setSprite(this.state.get())
    super.render(objet, program)
  }

  setState(state) {
    this.state.set(state)
  }

  setInteraction(interaction, changed) {
    this.behavior.setInteraction(interaction, changed)
  }

  updateState(name, inverse, corner) {
    this.inverseX = inverse
    this.cornerLeft = corner
    this.state.set(name)
  }

  update(offset, map) {
    super.update()
    this.behavior.setCollision(map)
    this.position[0] = this.behavior.getX() - offset.x
    this.position[1] = this.behavior.getY() - offset.y
  }

  setEndOfAnimation() {
    this.behavior.setEndOfAnimation()
  }

  getPosition() {
    return this.behavior.getPosition()
  }
}
