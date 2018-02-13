import MeshNormalMatrix from "./MeshNormalMatrix"

export default class extends MeshNormalMatrix {
  constructor(gl) {
    super(gl)
    this.lightPos = null
  }

  setEyePos(program, camera) {
    program.setVector("posEye", camera.getPosition().get())
  }

  setProgramSpecifics(program) {
    program.setVector("specular", [0.7, 0.7, 0.7])
    program.setFloat("brillance", 10)
    if (this.lightPos !== null) {
      program.setVector("posLum", this.lightPos.get())
    }
  }

  setLightPos(value) {
    this.lightPos = value
  }
}
