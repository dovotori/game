export default class ComportementMechant extends Comportement {
  constructor() {
    super();
    this.speed = 0.4;
    this.isHit = false;
  }

  setup() {
    Comportement.prototype.setup.call(this);
    this.position.set(10, 0, 0);
  }

  update(tilemap) {
    this.isHit = false;

    this.applyGravity(); // important gravite d'abord
    Comportement.prototype.update.call(this, tilemap);

    if (this.life > 0 && !this.isDead) {
      this.interaction();
      if (!this.transitionDamage.isFinished) {
        this.vitesse.x = this.transitionDamage.execute();
      }
    } else {
      this.vitesse.x = 0.0;
      this.isDead = true;
    }
  }

  interaction(tilemap) {
    if (this.isAffine) {
      if (this.isBlockGauche) {
        this.speed *= -1;
        this.isBlockGauche = false;
        this.isWayGauche = false;
      }
      if (this.isBlockDroite) {
        this.speed *= -1;
        this.isBlockDroite = false;
        this.isWayGauche = true;
      }
      this.vitesse.x = this.speed;
    } else {
      //this.vitesse.x = 0.0;
    }
  }

  collisionHeros(comportementHeros) {
    var posHeros = comportementHeros.getPosition();
    var tailleHeros = comportementHeros.getTaille();

    if (
      posHeros.distance(this.position) < (this.taille.x + tailleHeros.x) * 4.0 &&
      this.transitionDamage.isFinished
    ) {
      var isMelee = comportementHeros.getMelee();
      var coefDistAttaque = 4.0;
      var coefDistCollision = 2.0;

      if (
        posHeros.x <= this.position.x + this.taille.x * coefDistAttaque && // trop à droite
        posHeros.x + tailleHeros.x * coefDistAttaque >= this.position.x && // trop à gauche
        posHeros.y <= this.position.y + this.taille.y * coefDistAttaque && // trop en bas
        posHeros.y + tailleHeros.y * coefDistAttaque >= this.position.y
      ) {
        // trop en haut
        if (
          posHeros.x <= this.position.x + this.taille.x * coefDistCollision && // trop à droite
          posHeros.x + tailleHeros.x * coefDistCollision >= this.position.x && // trop à gauche
          posHeros.y <= this.position.y + this.taille.y * coefDistCollision && // trop en bas
          posHeros.y + tailleHeros.y * coefDistCollision >= this.position.y
        ) {
          // trop en haut
          // Collision
          if (posHeros.x > this.position.x) {
            comportementHeros.setVitesseX(4.0);
          } else {
            comportementHeros.setVitesseX(-4.0);
          }
          if (posHeros.y > this.position.y) {
            comportementHeros.setVitesseY(1.0);
          } else {
            comportementHeros.setVitesseY(-1.0);
          }
        } else if (isMelee) {
          // Attaque
          if (posHeros.x > this.position.x) {
            this.vitesse.x = -1.0;
          } else {
            this.vitesse.x = 1.0;
          }
          if (posHeros.y > this.position.y) {
            this.vitesse.y = 1.0;
          } else {
            this.vitesse.y = -1.0;
          }
          this.isHit = true;
          this.life -= 2;
          this.transitionDamage.setup(0, this.vitesse.x, this.timeTransitionDamage, easeOutCubic);
        } else {
          // Possibilité d'attaque
        }
      }
    }
  }

  collisionBullet(comportementHeros, ammunation) {
    var nbBalles = ammunation.getNbBalles();

    if (nbBalles > 0 && this.transitionDamage.isFinished) {
      var comportements = ammunation.getComportements();

      for (var i = 0; i < nbBalles; i++) {
        var posBalle = comportements[i].getPosition();
        var tailleBalle = comportements[i].getTaille();

        var coefDistCollision = 2.0;
        if (
          posBalle.x <= this.position.x + this.taille.x * coefDistCollision && // trop à droite
          posBalle.x + tailleBalle.x * coefDistCollision >= this.position.x && // trop à gauche
          posBalle.y <= this.position.y + this.taille.y * coefDistCollision && // trop en bas
          posBalle.y + tailleBalle.y * coefDistCollision >= this.position.y
        ) {
          // trop en haut
          var posHeros = comportementHeros.getPosition();
          // balle arrive de la droite
          if (posHeros.x > this.position.x) {
            this.vitesse.x = -1.0;
            // balle arrive de gauche
          } else {
            this.vitesse.x = 1.0;
          }
          this.isHit = true;
          this.life -= 0.5;
          this.transitionDamage.setup(0, this.vitesse.x, this.timeTransitionDamage, easeOutCubic);
        }
      }
    }
  }

  getHit() {
    return this.isHit;
  }
}
