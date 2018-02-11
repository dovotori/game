import Program from "./Program"
import Mesh from "./Mesh"
import glsl from "../../shaders/sprite"

export default class extends Mesh {
  constructor(gl, obj) {
    super(gl, obj)
    this.sprite = [0, 0, 1, 1, 1, 1]
  }

  setup() {
    this.program = new Program(this.gl, glsl)
  }

  setProgram() {
    this.program.setVector("spriteUV", [this.sprite[0], this.sprite[1]])
    this.program.setVector("spriteGrid", [this.sprite[2], this.sprite[3]])
    this.program.setVector("spriteSize", [this.sprite[4], this.sprite[5]])
  }

  setSprite(values) {
    this.sprite = values
  }
}
