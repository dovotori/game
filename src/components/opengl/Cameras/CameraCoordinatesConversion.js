import Camera from "./Camera"
import { Vec4, Mat4 } from "../../geometry"

export default class extends Camera {
  constructor(options) {
    super(options)
  }

  get2dScreenPoint(point, screenSize) {
    const x = point.getX()
    const y = point.getY()
    const z = point.getZ()
    const p = new Vec4(x, y, z, 1)
    const mat = new Mat4()
    mat.equal(this.view).multiply(this.projection)
    p.multiplyMatrix(mat)
    let X = p.getX() / p.getW()
    let Y = p.getY() / p.getW()
    X = (X + 1) * 0.5 * screenSize.width
    Y = (1 - Y) * 0.5 * screenSize.height
    return [X, Y]
  }
}
