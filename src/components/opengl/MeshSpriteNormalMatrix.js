import Mesh from "./MeshNormalMatrix"

export default class extends Mesh {
  constructor(gl) {
    super(gl)
    this.sprite = [0, 0, 1, 1, 1, 1]
  }

  setProgramSpecifics(program) {
    program.setVector("spriteUV", [this.sprite[0], this.sprite[1]])
    program.setVector("spriteGrid", [this.sprite[2], this.sprite[3]])
    program.setVector("spriteSize", [this.sprite[4], this.sprite[5]])
  }

  setSprite(values) {
    this.sprite = values
  }
}
