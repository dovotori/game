import Program from "./Program"
import Spring from "../Spring"
import Target from "../Target"
import Mat4 from "../geometrie/Mat4"
import glslColor from "../../shaders/color"

export default class {
  constructor(gl) {
    this.gl = gl
    this.programColor = new Program(this.gl, glslColor)
    this.model = new Mat4()
    this.model.identity()
    this.angle = { x: new Spring(), y: new Spring() }
    this.selected = false
    this.size = new Target(1, { sampling: 0.1 })
    this.setup()
  }

  setup() {
    this.program = new Program(this.gl, glslColor)
  }

  start(camera) {
    this.setMatrix(camera)
    this.setProgram()
  }

  setMatrix(camera) {
    this.program.setMatrix("model", this.model.get())
    this.program.setMatrix("view", camera.getView().get())
    this.program.setMatrix("projection", camera.getProjection().get())
  }

  setProgram() {
    this.program.setBool("selected", this.selected)
    this.program.setVector("color", [1.0, 1.0, 1.0, 1.0])
  }

  render(objet) {
    objet.enable(this.program.get())
    objet.render(this.program.get())
  }

  setTexture(idx, texture) {
    this.program.setTexture("tex" + idx, texture.get(), idx)
  }

  startColor(camera) {
    this.programColor.setMatrix("model", this.model.get())
    this.programColor.setMatrix("view", camera.getView().get())
    this.programColor.setMatrix("projection", camera.getProjection().get())
    this.programColor.setVector("color", [1.0, 1.0, 1.0, 1.0])
  }

  renderColor(objet) {
    objet.enable(this.programColor.get())
    this.programColor.enable()
    objet.render(this.programColor.get())
    this.programColor.disable()
  }

  update() {
    this.angle.x.update()
    this.angle.y.update()
    this.size.update()

    this.model.identity()
    this.model.rotate(this.angle.x.get(), 0, 1, 0)
    this.model.rotate(this.angle.y.get(), 1, 0, 0)
    this.model.scale(this.size.get())
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
}
