import StateSprite from "./StateSprite"
import MeshSprite from "../opengl/MeshSprite"
import heros from "../../sprites/heros"
import Behavior from "./BehaviorInteraction"

export default class extends MeshSprite {
  constructor(gl, perso) {
    super(gl)
    this.state = new StateSprite(heros)
    this.state.set("STAND")
    this.inverseX = false
    this.position = [perso.x || 0, perso.y || 0]
    this.behavior = new Behavior(perso)
  }

  render(objet, program, texture) {
    this.model.translate(
      this.position[0],
      this.position[1],
      this.behavior.getZ(),
    )
    program.setTexture(0, texture.get())
    program.setFloat("inverseX", this.inverseX ? 1 : 0)
    this.setSprite(this.state.get())
    super.render(objet, program)
  }

  setState(state) {
    this.state.set(state)
  }

  setInteraction(interaction, changed) {
    this.behavior.setInteraction(interaction)
    const state = this.behavior.getState()
    this.inverseX = state.inverse
    this.state.set(state.name)
  }

  update(offset, map) {
    super.update()
    this.behavior.setCollision(map)
    this.position[0] = this.behavior.getX() - offset.x
    this.position[1] = this.behavior.getY() - offset.y
  }

  getPosition() {
    return this.behavior.getPosition()
  }
}
