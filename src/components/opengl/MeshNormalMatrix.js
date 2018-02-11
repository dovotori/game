import Mesh from "./Mesh"
import Mat3 from "../geometrie/Mat3"

export default class extends Mesh {
  constructor(gl) {
    super(gl)
    this.normalMatrix = new Mat3()
  }

  setNormalMatrix(camera) {
    // transpose inverse de modelview
    const view = camera.getView()
    this.normalMatrix.egale(this.model.getMatrice3x3())
    this.normalMatrix.multiplier(view.getMatrice3x3())
    this.normalMatrix.inverser()
    this.program.setMatrix("normalmatrix", this.normalMatrix.transpose())
  }

  start(camera) {
    super.start(camera)
    this.setNormalMatrix(camera)
  }
}
