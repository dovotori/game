export default class {
  constructor() {
    this.nbBalles = 0
    this.bullets = new Array()
    this.comportements = new Array()
    this.oneShot = true
  }

  setup() {}

  draw(camera, program, objet, texture) {
    for (var i = 0; i < this.nbBalles; i++) {
      this.bullets[i].draw(camera, program, objet, texture)
    }
  }

  update(tilemap) {
    for (var i = 0; i < this.nbBalles; i++) {
      this.comportements[i].update(tilemap)
      this.bullets[i].update(this.comportements[i])

      if (this.comportements[i].getHit()) {
        this.delete(i)
      }
    }
  }

  create(position, isWayGauche) {
    if (this.oneShot) {
      this.nbBalles++
      var bullet = new PersoBullet()
      var comportement = new ComportementBullet()
      bullet.setup()
      comportement.setup()
      comportement.setPosition(position)
      comportement.activeAim(isWayGauche)

      this.bullets.push(bullet)
      this.comportements.push(comportement)
      this.oneShot = false
    }

    // suit le saut
    var direction = 4
    if (this.comportements[this.nbBalles - 1].getWayGauche()) {
      direction = -3
    }
    var p = new Vec3(position.x + direction, position.y, 0.4)
    this.comportements[this.nbBalles - 1].setPosition(p)
  }

  delete(num) {
    this.nbBalles--
    this.bullets.splice(num, 1)
    this.comportements.splice(num, 1)
  }

  setOneShot() {
    this.oneShot = true
    this.comportements[this.nbBalles - 1].activeShoot()
  }

  getNbBalles() {
    return this.nbBalles
  }
  getComportements() {
    return this.comportements
  }
}
