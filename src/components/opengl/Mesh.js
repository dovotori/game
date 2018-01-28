import Program from "./Program"
import Objet from "./Objet"
import Texture from "./Texture"
import Spring from "../Spring"
import Target from "../Target"
import Mat4 from "../geometrie/Mat4"
import glsl from "../../shaders/texture"
import primitive from "../../primitives/cube"

export default class Mesh {
  constructor(gl) {
    this.gl = gl
    this.texture = new Texture(this.gl)
    this.program = new Program(this.gl, glsl)
    this.objet = new Objet(this.gl)
    this.objet.setIndices(primitive.indice)
    this.objet.setPoints(primitive.position, "position")
    this.objet.setPoints(primitive.texture, "texture")
    this.mat = new Mat4()
    this.mat.identity()
    this.angle = { x: new Spring(), y: new Spring() }
    this.selected = false
    this.size = new Target(1, { sampling: 0.1 })
  }

  start(camera) {
    // this.program.setBool("selected", this.selected)
    this.program.setMatrix("model", this.mat.get())
    this.program.setMatrix("view", camera.getView())
    this.program.setMatrix("projection", camera.getProjection())
    this.program.setTexture("tex0", this.texture.get())
    this.objet.enable(this.program.get(), "position", 3)
    this.objet.enable(this.program.get(), "texture", 2)
  }

  render() {
    this.objet.render(this.program.get())
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
