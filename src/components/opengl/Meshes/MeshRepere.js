import Program from "../Program"
import Objet from "../ObjetPrimitive"
import { Mat4 } from "../../geometry"
import glsl from "../../../constants/shaders/color"
import primitive from "../../../constants/primitives/cube"

export default class {
  constructor(gl) {
    this.gl = gl
    this.program = new Program(this.gl, glsl)
    this.objet = new Objet(this.gl)
    this.objet.setIndices(primitive.indice)
    this.objet.setPoints(primitive.position, "position")

    this.model = new Mat4()
    this.model.identity()
  }

  render(camera) {
    this.program.setMatrix("model", this.model.get())
    this.program.setMatrix("view", camera.getView().get())
    this.program.setMatrix("projection", camera.getProjection().get())
    this.program.setVector("color", [1.0, 1.0, 1.0, 1.0])
    this.objet.enable(this.program.get(), "position", 3)
    this.objet.render(this.program.get())
  }

  update(pos) {
    this.model
      .identity()
      .scale(0.1, 0.1, 0.1)
      .translate(pos.getX(), pos.getY(), pos.getZ())
  }

  getModel() {
    return this.model
  }
}
