import Program from "./Program"
import Objet from "./Objet"
import glsl from "../../shaders/screen"
import primitive from "../../primitives/plane"

export default class Screen {
  constructor(gl) {
    this.gl = gl
    this.program = new Program(this.gl, glsl)
    this.objet = new Objet(this.gl)
    this.setupObjet()
  }

  setupObjet() {
    for (let key in primitive) {
      if (key === "indice") {
        this.objet.setIndices(primitive.indice)
      } else {
        this.objet.setPoints(primitive[key], key)
      }
    }
  }

  resize() {}

  render(texture) {
    this.program.setTexture("tex0", texture.get())
    this.objet.enable(this.program.get(), "position", 3)
    this.objet.enable(this.program.get(), "texture", 2)
    this.objet.render(this.program.get())
  }
}
