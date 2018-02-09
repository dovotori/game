import Program from "./Program"
import Mesh from "./Mesh"
import glsl from "../../shaders/sprite"

export default class extends Mesh {
  constructor(gl, obj) {
    super(gl, obj)
    this.spriteUV = [0, 0]
    this.spriteGridSize = [1, 1]
  }

  setup() {
    this.program = new Program(this.gl, glsl)
  }

  setProgram() {
    this.program.setVector("sprite", [
      this.spriteUV[0],
      this.spriteUV[1],
      this.spriteGridSize[0],
      this.spriteGridSize[1],
    ])
  }

  setUV(x, y) {
    this.spriteUV = [x, y]
  }

  setGridSize(w, h) {
    this.spriteGridSize = [w, h]
  }
}
