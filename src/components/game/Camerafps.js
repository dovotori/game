export default class extends Camera {
  constructor() {
    super()
    // FLY CAM
    this.forward = new Vec3()
    this.straf = new Vec3(0, 0, 0)
    this.angleX = -90.0
    this.angleY = 0.0
    this.vitesse = 0.1
    this.sensibilite = 0.1
    this.isEnable = false

    this.isJumped = false
    this.isSpamJump = false
    this.gravity = 0.4
    this.jumpMagnitude = 2.0
    this.currentJumpMagnitude = this.jumpMagnitude
    this.oldHauteur = 0
    this.isCroll = false
    this.taille = 3.0
    this.tmpTaille
  }

  setup() {
    Camera.prototype.setup.call(this)
    this.tmpTaille = this.taille
  }

  onMouseMove(event) {
    var movementX =
      event.movementX || event.mozMovementX || event.webkitMovementX || 0
    var movementY =
      event.movementY || event.mozMovementY || event.webkitMovementY || 0

    this.angleX += movementX * this.sensibilite
    this.angleY -= movementY * this.sensibilite

    if (this.angleY > 89) {
      this.angleY = 89
    } else if (this.angleY < -89) {
      // no looping
      this.angleY = -89
    }

    this.vectorsFromAngles()
  }

  vectorsFromAngles() {
    var axeUp = new Vec3(0, 1, 0) //une constante, le vecteur vertical du monde, utilisé dans les calculs

    var r_temp = Math.cos(this.angleY * Math.PI / 180)
    this.forward.y = Math.sin(this.angleY * Math.PI / 180)

    this.forward.x = r_temp * Math.cos(this.angleX * Math.PI / 180)
    this.forward.z = r_temp * Math.sin(this.angleX * Math.PI / 180)

    this.straf = axeUp.produitVectoriel(this.forward)
    this.straf.normaliser()

    this.cible = this.position.plus(this.forward) //comme on a bougé, on recalcule la cible fixée par la camera
    this.lookAt()
  }

  onKeyboard(input) {
    var oldY = this.position.y
    if (input.getClavier(32) && !this.isJumped && !this.isSpamJump) {
      // espace
      this.isJumped = true
      this.currentJumpMagnitude = this.jumpMagnitude
      this.isSpamJump = true
    } else if (!input.getClavier(32) && !this.isJumped) {
      this.isSpamJump = false
    }

    var vitesse = this.vitesse
    if (input.getClavier(16)) {
      vitesse *= 2.4
    } // shift
    if (input.getClavier(17)) {
      this.isCroll = true
    } else {
      this.isCroll = false
    } // ctrl

    if (input.getClavier(38) || input.getClavier(90)) {
      this.position = this.position.plus(this.forward.multiplierValeur(vitesse)) //on avance
    }
    if (input.getClavier(40) || input.getClavier(83)) {
      this.position = this.position.moins(
        this.forward.multiplierValeur(vitesse),
      ) //on recule
    }
    if (input.getClavier(37) || input.getClavier(81)) {
      this.position = this.position.plus(this.straf.multiplierValeur(vitesse)) //on se déplace sur la gauche
    }
    if (input.getClavier(39) || input.getClavier(68)) {
      this.position = this.position.moins(this.straf.multiplierValeur(vitesse)) //on se déplace sur la droite
    }
    this.position.y = oldY
    this.cible = this.position.plus(this.forward) //comme on a bougé, on recalcule la cible fixée par la caméra

    this.lookAt()
  }

  updateToTerrain(input, terrain) {
    // croll
    if (this.isCroll && this.tmpTaille > this.taille * 0.5) {
      this.tmpTaille -= 0.1
    } else if (this.isCroll) {
      this.tmpTaille = this.taille * 0.5
    } else if (!this.isCroll && this.tmpTaille < this.taille) {
      this.tmpTaille += 0.1
    }

    var hauteurSurTerrain =
      terrain.getHauteur(this.position.x, this.position.z) + this.tmpTaille

    // saut
    if (!this.isJumped) {
      this.position.y = hauteurSurTerrain
    } else {
      this.position.y += this.currentJumpMagnitude
      this.currentJumpMagnitude -= this.gravity
      if (this.position.y <= hauteurSurTerrain + this.tmpTaille) {
        this.isJumped = false
      }
    }

    this.setPosition(this.position.x, this.position.y, this.position.z)
    this.onKeyboard(input)
  }

  setVitesse(value) {
    this.vitesse = value
  }
  setTaille(value) {
    this.taille = value
  }
  setGravity(value) {
    this.gravity = value
  }
  setJumpForce(value) {
    this.jumpMagnitude = value
  }

  toggle() {
    this.isEnable = !this.isEnable
  }
  getState() {
    return this.isEnable
  }
  getEyeDirection() {
    return this.cible.moins(this.position)
  }
}
