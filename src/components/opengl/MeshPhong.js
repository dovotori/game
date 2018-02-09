import Program from "./Program"
import MeshNormalMatrix from "./MeshNormalMatrix"
import glsl from "../../shaders/phong"

export default class extends MeshNormalMatrix {
  constructor(gl, obj) {
    super(gl, obj)
    this.lightPos = null
  }

  setup() {
    this.program = new Program(this.gl, glsl)
  }

  start(camera) {
    super.start(camera)
    this.setEyePos(camera)
  }

  setEyePos(camera) {
    this.program.setVector("posEye", camera.getPosition().get())
  }

  setProgram() {
    this.program.setBool("selected", this.selected)
    this.program.setVector("ambiant", [0.5, 0, 0])
    this.program.setVector("diffuse", [1, 0, 0])
    this.program.setVector("specular", [1, 1, 1])
    this.program.setFloat("brillance", 10)
    if (this.lightPos !== null) {
      this.program.setVector("posLum", this.lightPos.get())
    }
  }
}
