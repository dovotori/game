import Mesh from "./Mesh"
import Mat3 from "../../geometry/Mat3"

export default class extends Mesh {
  constructor() {
    super()
    this.normalMatrix = new Mat3()
  }

  setNormalMatrix(program /*, camera*/) {
    // transpose inverse de modelview
    // const view = camera.getView()
    this.normalMatrix.equal(this.model.getMatrice3x3())
    // this.normalMatrix.multiply(view.getMatrice3x3()) // commenter pour que la camera n'influe pas la lumiere
    this.normalMatrix.inverse()
    program.setMatrix("normalmatrix", this.normalMatrix.transpose())
  }
}
