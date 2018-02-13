import StateSprite from "./StateSprite"
import heros from "../../sprites/heros"
import MeshSprite from "../opengl/MeshSprite"

export default class extends MeshSprite {
  constructor(gl) {
    super(gl)
    this.state = new StateSprite(heros)
    this.state.set("STAND")
  }

  render(objet, program, texture) {
    this.model.translate(0, 0, 0.1)
    program.setTexture(0, texture.get())
    this.setSprite(this.state.get())
    super.render(objet, program)
  }

  setState(state) {
    this.state.set(state)
  }
}
