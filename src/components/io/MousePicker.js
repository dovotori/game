import { mapFromRange } from "../../utils/numbers"
import Vec4 from "../geometry/Vec4"
import Mat4 from "../geometry/Mat4"

export default class {
  constructor() {
    this.rayon = new Vec4(0, 0, 0, 0)
  }

  get(mousePos, camera) {
    var relX = mapFromRange(mousePos.clientX, 0, window.innerWidth, -1, 1)
    var relY = mapFromRange(mousePos.clientY, 0, window.innerHeight, 1, -1)
    this.rayon.set(relX, relY, -1.0, 1.0) // -1 en z pour pointer "devant"

    var proj = new Mat4()
    proj.egale(camera.getProjection())
    proj.inverser()
    this.rayon.egale(this.rayon.multiplierMatrice(proj))
    this.rayon.set(this.rayon.x, this.rayon.y, -1.0, 0.0)

    var view = new Mat4()
    view.egale(camera.getView())
    view.inverser()
    this.rayon.egale(this.rayon.multiplierMatrice(view))
    this.rayon.normaliser()
    return this.rayon
  }
}
