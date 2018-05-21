import Camera from "./Camera"
import Vec3 from "../../geometry/Vec3"
import Vec4 from "../../geometry/Vec4"
import Mat4 from "../../geometry/Mat4"

export default class extends Camera {
  constructor(options) {
    super(options)
    this.viewProjection = new Mat4()
    this.viewProjectionInverse = new Mat4()

    this.lookAt()
  }

  update() {
    this.viewProjection.egale(this.view)
    this.viewProjection.multiplier(this.projection)

    this.viewProjectionInverse.egale(this.viewProjection)
    this.viewProjectionInverse.inverser()
  }

  get2dPoint(point3D) {
    let point = new Vec4(point3D[0], point3D[1], point3D[2], 1.0)
    point = point.multiplierMatrice(this.viewProjectionInverse)
    let x = point.getX() / point.getZ()
    let y = point.getY() / point.getZ()
    console.log(point3D, point, { x, y })
    // convert -1, 1 to 0, 0.5
    x = (x + 1) * 0.5
    y = (y + 1) * 0.5 // inverse y
    return [x, y]
  }

  get2dScreenPoint(point3D, screenSize) {
    const point = this.get2dPoint(point3D)
    const x = point[0] * screenSize.width
    const y = point[1] * screenSize.height // inverse Y
    return [x, y]
  }

  get3dPoint(point2D /*, screen*/) {
    // const x = 2.0 * winX / screen.width - 1
    // const y = -2.0 * winY / screen.height + 1
    const point3D = new Vec3(point2D[0], point2D[1], 0)
    return point3D.multiplierMatrice(this.viewProjectionInverse.getMatrice3x3())
  }
}
