import Node from "Node"

export default class extends Node {
  constructor() {
    super()
    this.acceleration = new Vec3(0, 0, 0)
  }

  // Oiseau.vitesseMax = 2;
  // Oiseau.forceMax = 0.2;
  // Oiseau.masse = 1;
  // Oiseau.rayonCercleRalentissement = 100;
  // Oiseau.distanceSeparation = Node.taille*2;
  // Oiseau.distanceAlignement = 50;
  // Oiseau.distanceCohesion = 100;

  setup(x, y, z) {
    Node.prototype.setup.call(this, x, y, z)

    var angle = random(0, Math.PI)
    this.vitesse.set(Math.cos(angle), Math.sin(angle), Math.tan(angle))
    //this.vitesse.set(1, 1, 1);
  }

  draw2d() {
    context.save()
    context.translate(this.position.x, this.position.y)

    // REPERE VECTEUR VITESSE
    var d = new Vec3()
    d.egale(this.vitesse)
    var longueur = map(d.longueur(), 0, Oiseau.vitesseMax, 0, 40)
    d.normaliser()

    context.strokeStyle = "#f00"
    context.lineWidth = 1
    context.beginPath()
    context.moveTo(0, 0)
    context.lineTo(d.x * longueur, d.y * longueur)
    context.stroke()

    // TRIANGLE
    var v = new Vec3(0, -1, 0)
    var angle = v.angleDegree(this.vitesse)

    context.rotate(angle * Math.PI / 180) // rotate veut des radians
    context.fillStyle = "#fff"

    context.beginPath()
    context.moveTo(-Node.taille / 2, 5 * Node.taille / 4)
    context.lineTo(0, -(5 * Node.taille) / 4)
    context.lineTo(Node.taille / 2, 5 * Node.taille / 4)
    context.closePath()

    context.fill()

    context.strokeStyle = "#000"
    context.stroke()

    context.restore()
  }

  update(cible) {
    this.vitesse = this.seekSteering(cible)
    this.position = this.position.plus(this.vitesse)
  }

  ///////////////////////////////////////////////////////////////////////////
  ////////////////////////// COMPORTEMENT ///////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////

  seek(cible) {
    // ATTIRER PAR LA CIBLE
    var direction = cible.moins(this.position)
    direction = direction.multiplierValeur(Oiseau.vitesseMax)
    direction.normaliser()

    return direction
  }

  seekSteering(cible) {
    // ATTIRER PAR LA CIBLE AVEC UN SMOOTH DE TRAJECTOIRE
    var directionDesiree = this.seek(cible)
    var direction = directionDesiree.moins(this.vitesse)
    direction.limiter(Oiseau.forceMax) // ou tronquer
    direction = direction.diviserValeur(Oiseau.masse) // la masse influe le temps pour changer de direction, plus grand plus long
    direction = direction.plus(this.vitesse)
    direction.limiter(Oiseau.vitesseMax)

    return direction
  }

  seekSteeringArrival(cible) {
    // STEERING AVEC UN RALENTISSEMENT A L'ARRIVEE
    var directionDesiree = cible.moins(this.position)
    var distance = directionDesiree.longueur()

    if (distance < Oiseau.rayonCercleRalentissement) {
      directionDesiree.normaliser()
      var ralentissement =
        Oiseau.vitesseMax * (distance / Oiseau.rayonCercleRalentissement)
      directionDesiree = directionDesiree.multiplierValeur(ralentissement)
    } else {
      directionDesiree = directionDesiree.multiplierValeur(Oiseau.vitesseMax)
      directionDesiree.normaliser()
    }

    var direction = directionDesiree.moins(this.vitesse)
    direction.limiter(Oiseau.forceMax)
    direction = direction.plus(this.vitesse)
    return direction
  }

  flee(cible) {
    // FUIT LA CIBLE
    var direction = this.seek(cible)
    direction = direction.multiplierValeur(-1) // on inverse par rapport a seek
    return direction
  }

  fleeSteering(cible) {
    // FUIT LA CIBLE EN STEERING
    var direction = this.seekSteering(cible)
    direction = direction.multiplierValeur(-1) // on inverse par rapport a seek
    return direction
  }

  ///////////////////////////////////////////////////////////////////////////
  ////////////////////////// GROUPE MOUV ///////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////

  updateTroupeau(oiseaux) {
    this.defineAcceleration(oiseaux)

    this.vitesse = this.vitesse.plus(this.acceleration) // on ajoute l'acceleration a la vitesse
    this.vitesse.limiter(Oiseau.vitesseMax) // on limite la vitesse
    this.position = this.position.plus(this.vitesse) // on ajoute la vitesse a la position

    this.acceleration.set(0, 0, 0) // reset de l'acceleration
  }

  defineAcceleration(oiseaux) {
    // SEPARATION espace les oiseaux
    var forceSeparation = new Vec3(0, 0, 0)
    var cptSeparation = 0

    // ALIGNEMENT dirige vers une direction commune
    var forceAlignement = new Vec3(0, 0, 0)
    var cptAlignement = 0

    // COHESION crée un groupe uni d'ioseaux
    var forceCohesion = new Vec3(0, 0, 0)
    var cptCohesion = 0

    /////////////////////// BOUCLE VOISINS ///////////////////////
    for (var i = 0; i < oiseaux.length; i++) {
      var distance = this.position.distance(oiseaux[i].getPosition())

      if (distance > 0) {
        // exclue soit meme
        // SEPARATION
        if (distance < Oiseau.distanceSeparation) {
          var ajoutForce = this.position.moins(oiseaux[i].getPosition())
          ajoutForce.normaliser()
          ajoutForce = ajoutForce.diviserValeur(distance) // plus le voisin est loin moins la force est importante
          forceSeparation = forceSeparation.plus(ajoutForce)
          cptSeparation++
        }

        // ALIGNEMENT
        if (distance < Oiseau.distanceAlignement) {
          forceAlignement = forceAlignement.plus(oiseaux[i].getVitesse())
          cptAlignement++
        }

        // COHESION
        if (distance < Oiseau.distanceCohesion) {
          forceCohesion = forceCohesion.plus(oiseaux[i].getPosition())
          cptCohesion++
        }
      }
    }

    /////////////////////// DEFINITION DES FORCES ///////////////////////

    // SEPARATION
    if (cptSeparation > 0) {
      forceSeparation = forceSeparation.diviserValeur(cptSeparation) // divise par le nombre de voisin
    }

    if (forceSeparation.longueur() > 0) {
      forceSeparation.normaliser()
      forceSeparation = forceSeparation.multiplierValeur(Oiseau.vitesseMax)

      // steer
      forceSeparation = forceSeparation.moins(this.vitesse)
      forceSeparation.limiter(Oiseau.forceMax)
    }

    // ALIGNEMENT
    if (cptAlignement > 0) {
      forceAlignement = forceAlignement.diviserValeur(cptAlignement) // divise par le nombre de voisin
      forceAlignement.normaliser()
      forceAlignement = forceAlignement.multiplierValeur(Oiseau.vitesseMax)

      // steer
      forceAlignement = forceAlignement.moins(this.vitesse)
      forceAlignement.limiter(Oiseau.forceMax)
    }

    // COHESION
    if (cptCohesion > 0) {
      forceCohesion = forceCohesion.diviserValeur(cptCohesion)
      forceCohesion = this.seekSteering(forceCohesion)
    }

    /////////////////////// ON APPLIQUE ///////////////////////

    // gerer les influences arbitrairement
    forceSeparation = forceSeparation.multiplierValeur(1.5)

    // appliquer la masse
    var forces = new Vec3()
    forces = forces.plus(forceSeparation)
    forces = forces.plus(forceAlignement)
    forces = forces.plus(forceCohesion)
    forces = forces.diviserValeur(Oiseau.masse)

    // on forme l'acceleration
    this.acceleration = this.acceleration.plus(forces)
  }

  setDistanceSeparation(valeur) {
    Oiseau.distanceSeparation = valeur
  }
  setDistanceAlignement(valeur) {
    Oiseau.distanceAlignement = valeur
  }
  setDistanceCohesion(valeur) {
    Oiseau.distanceCohesion = valeur
  }
}
