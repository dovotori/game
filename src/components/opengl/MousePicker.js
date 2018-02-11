export default class {
  constructor() {
    this.rayon = new Vec4(0, 0, 0, 0)
    this.margeTop = 0
  }

  setup() {
    this.resize()
  }

  resize() {
    // calcul marge du haut
    var elem = document.getElementById("canvas3d")
    while (elem.offsetTop != null) {
      this.margeTop += elem.offsetTop
      elem = elem.parentNode
    }
  }

  update(event, camera) {
    //var relX = event.clientX / event.target.offsetWidth;
    //var relY = event.clientY-(this.margeTop - window.pageYOffset) / event.target.offsetHeight;
    var relX = map(event.clientX, 0, window.innerWidth, -1, 1)
    var relY = map(event.clientY, 0, window.innerHeight, 1, -1)
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
  }

  getRayon() {
    return this.rayon
  }
}
