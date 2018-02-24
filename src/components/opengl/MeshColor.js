import Mesh from "./Mesh"

export default class extends Mesh {
  constructor(gl) {
    super(gl)
    this.color = [255, 255, 255, 1]
  }

  render(objet, program) {
    this.setProgram(program)
    program.setBool("selected", this.selected)
    program.setVector("color", [
      this.color[0] / 255,
      this.color[1] / 255,
      this.color[2] / 255,
      this.color[3],
    ])
    objet.enable(program.get())
    objet.render(program.get())
  }

  setColor(r, g, b, a) {
    this.color = [r, g, b, a]
  }
}
