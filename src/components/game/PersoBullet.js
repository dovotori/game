export default class extends Perso {
  constructor() {
    super()
  }

  setup() {
    Perso.prototype.setup.call(this)

    this.sprite.setTaille(1, 1, 0.1)
    this.sprite.setSpeed(40)
    this.sprite.setGrille(8, 8)
    this.sprite.setMode(1)
    this.sprite.setUDepart(6)
    this.sprite.setULimite(8)
    this.sprite.setUV(6, 4)
  }

  draw(camera, program, objet, texture) {
    if (texture.isReady()) {
      program.setTexture(texture.get())
    }
    Perso.prototype.draw.call(this, camera, program, objet)
  }

  update(comportement) {
    Perso.prototype.update.call(this, comportement)

    var isWayGauche = comportement.getWayGauche()
    Perso.prototype.animOrientation.call(this, isWayGauche)

    this.animation(comportement)
  }

  animation(comportement) {
    var isShoot = comportement.getShoot()
    var isAim = comportement.getAim()

    if (isShoot) {
      this.sprite.setV(3)
    } else {
      this.sprite.setV(4)
    }
  }
}
