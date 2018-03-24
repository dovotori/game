import Camera from "./CameraSmooth"
import Vec3 from "../../geometry/Vec3"
import Vec4 from "../../geometry/Vec4"
import Mat4 from "../../geometry/Mat4"

export default class extends Camera {
  constructor(options) {
    super(options)
    this.viewProjection = new Mat4()
    this.viewProjectionInverse = new Mat4()
  }

  update(time) {
    super.update()
    // this.target.set(
    //   Math.cos(time * 0.1) * 1,
    //   this.target.getY(),
    //   this.target.getZ(),
    // )
    // this.lookAt()

    this.viewProjection.egale(this.projection)
    this.viewProjection.multiplier(this.view)

    this.viewProjectionInverse.egale(this.viewProjection)
    this.viewProjectionInverse.inverser()
  }

  get2dPoint(point3D) {
    const point = new Vec3(point3D[0], point3D[1], point3D[2])
    const point2 = point.multiplierMatrice(this.viewProjection.getMatrice3x3())
    let x = point2.getX() / this.position.getZ()
    let y = point2.getY() / this.position.getZ()
    // convert -1, 1 to 0, 0.5
    x = (x + 1) * 0.5
    y = (y + 1) * -0.5 // inverse y
    return [x, y]
  }

  get2dScreenPoint(point3D, screenSize) {
    let point = new Vec4(point3D[0], point3D[1], point3D[2], 1.0)
    const point2 = point.multiplierMatrice(this.viewProjection)
    const w = this.position.getZ() - this.target.getZ() - point.getZ()
    let x = point2.getX() / w
    let y = point2.getY() / w
    const centerScreen = {
      x: screenSize.width * 0.5,
      y: screenSize.height * 0.5,
    }
    x = centerScreen.x + x * centerScreen.x
    y = centerScreen.y + y * -centerScreen.y // inverse Y
    return [x, y]
  }

  get3dPoint(point2D /*, screen*/) {
    // const x = 2.0 * winX / screen.width - 1
    // const y = -2.0 * winY / screen.height + 1
    const point3D = new Vec3(point2D[0], point2D[1], 0)
    return point3D.multiplierMatrice(this.viewProjectionInverse.getMatrice3x3())
  }
}
