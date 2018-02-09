import Program from "./Program"
import Objet from "./ObjetPrimitive"
import Mat4 from "../geometrie/Mat4"
import glsl from "../../shaders/color"
import primitive from "../../primitives/cube"

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
    this.model.identity()
    this.model.scale(0.1, 0.1, 0.1)
    this.model.translate(pos.getX(), pos.getY(), pos.getZ())
  }
}
