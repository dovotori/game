import Program from "./Program"
import MeshNormalMatrix from "./MeshNormalMatrix"
import glsl from "../../shaders/normalmapping"

export default class extends MeshNormalMatrix {
  constructor(gl) {
    super(gl)
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
    this.program.setVector("specular", [0.7, 0.7, 0.7])
    this.program.setFloat("brillance", 10)
    if (this.lightPos !== null) {
      this.program.setVector("posLum", this.lightPos.get())
    }
  }
}
