import StateSprite from "./StateSprite"
import tiles from "../../sprites/tiles"
import MeshSprite from "../opengl/MeshSpriteNormalMatrix"

export default class extends MeshSprite {
  constructor() {
    super()
    this.state = new StateSprite(tiles)
    this.state.set("000")
  }

  render(objet, program, texture) {
    program.setTexture(0, texture.get())
    this.setSprite(this.state.get())
    super.render(objet, program)
  }

  setState(state) {
    this.state.set(state)
  }
}
