import Spring from "../Spring"
import Target from "../Target"
import Mat4 from "../geometrie/Mat4"

export default class {
  constructor(gl) {
    this.gl = gl
    this.model = new Mat4()
    this.model.identity()
    this.angle = { x: new Spring(), y: new Spring() }
    this.selected = false
    this.size = new Target(1, { sampling: 0.1 })
  }

  setProgram(program) {
    program.setMatrix("model", this.model.get())
  }

  setProgramSpecifics(program) {
    program.setBool("selected", this.selected)
    program.setVector("color", [1.0, 1.0, 1.0, 1.0])
  }

  render(objet, program) {
    this.setProgram(program)
    this.setProgramSpecifics(program)
    objet.enable(program.get())
    objet.render(program.get())
  }

  renderColor(objet, program) {
    this.setProgram(program)
    program.setBool("selected", this.selected)
    program.setVector("color", [1.0, 1.0, 1.0, 1.0])
    objet.enable(program.get())
    objet.render(program.get())
  }

  update() {
    // this.angle.x.update()
    // this.angle.y.update()
    // this.size.update()

    this.model.identity()
    // this.model.rotate(this.angle.x.get(), 0, 1, 0)
    // this.model.rotate(this.angle.y.get(), 1, 0, 0)
    // this.model.scale(this.size.get())
  }

  setDraggingInfos(pos) {
    this.angle.x.addToSpeed(pos.relPrevious.x * 0.1)
    this.angle.y.addToSpeed(pos.relPrevious.y * -0.1)
  }

  setSelected(pixel) {
    this.selected = pixel[0] === 255 && pixel[1] === 255 && pixel[2] === 255
    this.size.set(this.selected ? 1.1 : 1)
  }

  setLightPos(pos) {
    this.lightPos = pos
  }

  reset() {
    this.model.identity()
  }

  setTranslate(x, y, z = 0) {
    this.model.translate(x, y, z)
  }

  setScale(x, y, z = 0) {
    this.model.scale(x, y, z)
  }
}
