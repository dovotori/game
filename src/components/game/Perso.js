import StateSprite from "./StateSprite"
import MeshSprite from "../opengl/MeshSprite"
import heros from "../../sprites/heros"
import Behavior from "./Behavior"

export default class extends MeshSprite {
  constructor(gl) {
    super(gl)
    this.state = new StateSprite(heros)
    this.behavior = new Behavior()
    this.state.set("STAND")
    this.inverseX = 0.0
  }

  render(objet, program, texture) {
    this.behavior.render()
    this.model.translate(
      this.behavior.getPosition()[0],
      this.behavior.getPosition()[1],
      this.behavior.getPosition()[2],
    )
    program.setTexture(0, texture.get())
    program.setFloat("inverseX", this.inverseX)
    this.setSprite(this.state.get())
    super.render(objet, program)
  }

  setState(state) {
    this.state.set(state)
  }

  setInteraction(interaction, changed) {
    this.behavior.setInteraction(interaction)
    if (changed) {
      if (interaction.LEFT && interaction.RIGHT) {
        this.state.set("STAND")
      } else if (interaction.RIGHT) {
        this.inverseX = 0.0
        this.state.set("RUN")
      } else if (interaction.LEFT) {
        this.inverseX = 1.0
        this.state.set("RUN")
      } else {
        this.state.set("STAND")
      }
    }
  }
}
