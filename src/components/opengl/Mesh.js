import Program from "./Program"
import Objet from "./ObjetObj"
import Texture from "./Texture"
import Spring from "../Spring"
import Target from "../Target"
import Mat4 from "../geometrie/Mat4"
import glsl from "../../shaders/normalmapping"
import glsl2 from "../../shaders/color"
// import primitive from "../../primitives/cube"

export default class Mesh {
  constructor(gl, obj) {
    this.gl = gl
    this.texture = new Texture(this.gl)
    this.program = new Program(this.gl, glsl)
    this.program2 = new Program(this.gl, glsl2)
    this.objet = new Objet(this.gl, obj)

    // this.objet = new Objet(this.gl)
    // this.objet.setModeDessin(this.gl.LINES)
    // this.objet.setIndices(primitive.indice)
    // this.objet.setPoints(primitive.position, "position")
    // this.objet.setPoints(primitive.texture, "texture")

    // this.objet.setIndices(obj.v.indices)
    // this.objet.setPoints(obj.v.points, "position")

    // this.objet.setPoints(obj.vt.points, "texture")
    this.mat = new Mat4()
    this.mat.identity()
    this.angle = { x: new Spring(), y: new Spring() }
    this.selected = false
    this.size = new Target(1, { sampling: 0.1 })
  }

  start(camera) {
    this.program.setBool("selected", this.selected)
    this.program.setMatrix("model", this.mat.get())
    this.program.setMatrix("view", camera.getView())
    this.program.setMatrix("projection", camera.getProjection())
    // this.program.setTexture("tex0", this.texture.get())
    // this.program.setTexture("tex0", texture.get())
    // this.objet.enable(this.program.get(), "position", 3)
    // this.objet.enable(this.program.get(), "texture", 2)
    this.objet.enable(this.program.get())
  }

  render() {
    this.objet.render(this.program.get())
  }

  setTexture(idx, texture) {
    this.program.setTexture("tex" + idx, texture.get(), idx)
  }

  startColor(camera) {
    this.program2.setMatrix("model", this.mat.get())
    this.program2.setMatrix("view", camera.getView())
    this.program2.setMatrix("projection", camera.getProjection())
    this.program2.setVector("color", [1.0, 1.0, 1.0, 1.0])
    // this.objet.enable(this.program2.get(), "position", 3)
    this.objet.enable(this.program2.get())
  }

  renderColor() {
    this.program2.enable()
    this.objet.render(this.program2.get())
    this.program2.disable()
  }

  update() {
    this.angle.x.update()
    this.angle.y.update()
    this.size.update()

    this.mat.identity()
    this.mat.rotate(this.angle.x.get(), 0, 1, 0)
    this.mat.rotate(this.angle.y.get(), 1, 0, 0)
    this.mat.scale(this.size.get())
  }

  setDraggingInfos(pos) {
    this.angle.x.addToSpeed(pos.relPrevious.x * 0.1)
    this.angle.y.addToSpeed(pos.relPrevious.y * -0.1)
  }

  setSelected(pixel) {
    this.selected = pixel[0] === 255 && pixel[1] === 255 && pixel[2] === 255
    this.size.set(this.selected ? 1.1 : 1)
  }
}
