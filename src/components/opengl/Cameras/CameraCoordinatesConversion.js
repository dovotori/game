import { vec4, mat4, vec3 } from "gl-matrix"
import Camera from "./Camera"
import Vec3 from "../../geometry/Vec3"
import Vec4 from "../../geometry/Vec4"
import Mat4 from "../../geometry/Mat4"

export default class extends Camera {
  constructor(options) {
    super(options)
    this.viewProjection = new Mat4()
    this.viewProjectionInverse = new Mat4()
  }

  update() {
    this.viewProjection.egale(this.view)
    this.viewProjection.multiplier(this.projection)
    // this.viewProjectionInverse.egale(this.viewProjection)
    // this.viewProjectionInverse.inverser()
  }

  get2dPoint(point3D) {
    // model * view * projection * perspectie division * screen
    // let point = new Vec4(point3D[0], point3D[1], point3D[2], point3D[2])
    // point = point.multiplierMatrice(this.viewProjection)
    // let x = point.getX() / point.getZ()
    // let y = point.getY() / point.getZ()
    // // convert -1, 1 to 0, 0.5
    // x = (2 * x + 1) * 0.5
    // y = (2 * y + 1) * 0.5 // inverse y
    // return [x, y]
    return null
  }

  get2dScreenPoint(point3D, model, screenSize) {
    const start = vec4.create()
    vec4.set(start, point3D[0], point3D[1], point3D[2], point3D[2])

    const eye = vec3.create()
    const center = vec3.create()
    const up = vec3.create()
    vec3.set(eye, 10, 10, 30)
    vec3.set(center, 10, 10, 0)
    vec3.set(up, 0, 1, 0)

    const matView = mat4.create()
    mat4.lookAt(matView, eye, center, up)

    const matProjection = mat4.create()
    mat4.perspective(
      matProjection,
      this.angle * (Math.PI / 180),
      screenSize.width / screenSize.height,
      this.near,
      this.far,
    )

    // const matProjectionView = mat4.create()
    // mat4.multiply(matProjectionView, matProjection, matView)

    const end = vec4.create()
    vec4.transformMat4(end, start, matView)

    this.projection.identity()
    this.projection.perspective(
      this.angle,
      screenSize.width / screenSize.height,
      this.near,
      this.far,
    )

    let point = new Vec4(point3D[0], point3D[1], point3D[2], point3D[3])
    let point2 = new Vec4(10, 10, 10, 1)
    point2 = point2.multiplierMatrice(model)
    console.log(point, point2, model)
    // console.log(1, point)
    // point = point.multiplierMatrice(this.view)
    // console.log(2, point)
    // point = point.multiplierMatrice(this.projection)
    // console.log(3, point)

    const midScreenWidth = screenSize.width / 2
    let x = point.getX()
    // x /= point.getZ()
    x = midScreenWidth + x * midScreenWidth

    const y = 300
    return [x, y]
  }

  get3dPoint(point2D /*, screen*/) {
    // const x = 2.0 * winX / screen.width - 1
    // const y = -2.0 * winY / screen.height + 1
    const point3D = new Vec3(point2D[0], point2D[1], 0)
    return point3D.multiplierMatrice(this.viewProjectionInverse.getMatrice3x3())
  }
}
