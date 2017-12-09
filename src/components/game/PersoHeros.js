export default class PersoHeros extends Perso {
  constructor() {
    super();

    this.soundShoot = null;
    this.soundMelee = null;
    this.texture = new Texture();
    this.oldAffine = false;
    this.oldVitesseY = 0;

    this.ammunation = new Ammunation();
  }

  setup() {
    this.texture.setup(this.cheminTexture);

    Perso.prototype.setup.call(this);

    this.sprite.setUV(0, 0);
    this.sprite.setSpeed(200);
    this.sprite.setMode(1);
    this.sprite.setGrille(8, 8);
    this.sprite.setUVDepart(0, 0);
    this.sprite.setUVLimite(2, 1);

    this.ammunation.setup();

    this.soundShoot = document.getElementById('sound_shoot');
    this.soundMelee = document.getElementById('sound_melee');
  }

  draw(camera, program, objet) {
    if (this.texture.isReady()) {
      program.setTexture(this.texture.get());
    }
    Perso.prototype.draw.call(this, camera, program, objet);

    this.ammunation.draw(camera, program, objet, this.texture);
  }

  /*////// UPDATE ////////////////////////////////*/

  update(comportement, input, tilemap) {
    Perso.prototype.update.call(this, comportement);

    var vitesse = comportement.getVitesse();
    var taille = comportement.getTaille();
    var tailleReference = comportement.getTailleReference();
    var endAnim = this.sprite.getEndAnim();
    var position = comportement.getPosition();

    var isWayGauche = comportement.getWayGauche();
    var isAffine = comportement.getAffine();
    var isAim = comportement.getAim();
    var isShoot = comportement.getShoot();
    var isMelee = comportement.getMelee();
    var isDash = comportement.getDash();
    var isRunned = comportement.getRun();
    var isKeyChanged = input.getChangeKey();

    Perso.prototype.animOrientation.call(this, isWayGauche);

    // MELEE
    if (isMelee || !endAnim) {
      if (isMelee) {
        this.activeMelee(isWayGauche);
      } else {
        this.animMelee(isWayGauche);
      }
      // SHOOT
    } else if (isAim) {
      this.animAim();
      this.ammunation.create(position, isWayGauche);
      // SHOOT
    } else if (isShoot) {
      this.animShoot();
      this.ammunation.setOneShot();
    } else {
      // SAUT
      if (!isAffine) {
        this.animSaut(vitesse);
        // RUN
      } else if (isRunned) {
        // DASH
        if (isDash) {
          this.animDash(isKeyChanged, tailleReference, isWayGauche);
        } else {
          this.animRun(isKeyChanged, tailleReference);
        }
        // IMMOBILE
      } else {
        this.animImmobile(tailleReference);
      }
    }

    this.oldAffine = isAffine;
    this.oldVitesseY = vitesse.y;

    this.ammunation.update(tilemap);
  }

  animSaut(vitesse) {
    this.sprite.setV(1);
    this.sprite.setGrille(8, 8);

    if (vitesse.y > 0) {
      // saut
      if (Math.abs(vitesse.x) <= 0.2) {
        // saut droit
        this.sprite.setU(0);
        this.sprite.setUDepart(0);
        this.sprite.setULimite(2);
      } else {
        // saut cote
        this.sprite.setU(4);
        this.sprite.setUDepart(4);
        this.sprite.setULimite(6);
      }
    } else {
      // chute
      if (Math.abs(vitesse.x) <= 0.2) {
        // chute droite
        this.sprite.setU(2);
        this.sprite.setUDepart(2);
        this.sprite.setULimite(4);
      } else {
        // chute cote
        this.sprite.setU(6);
        this.sprite.setUDepart(6);
        this.sprite.setULimite(8);
      }
    }
  }

  animImmobile(tailleReference) {
    this.sprite.setV(0);
    this.sprite.setSpeed(200);
    this.sprite.setMode(1);
    this.sprite.setGrille(8, 8);
    this.sprite.setUVDepart(0, 0);
    this.sprite.setUVLimite(2, 1);
    this.sprite.setTaille(tailleReference, tailleReference, 0.1);
  }

  animRun(isKeyChanged, tailleReference) {
    if (isKeyChanged || !this.oldAffine) {
      this.sprite.setU(2);
    }
    this.sprite.setV(0);
    this.sprite.setUDepart(2);
    this.sprite.setULimite(6);
    this.sprite.setGrille(8, 8);
  }

  animDash(isKeyChanged, tailleReference, isWayGauche) {
    if (isKeyChanged || !this.oldAffine) {
      this.sprite.setU(0);
    } // first
    this.sprite.setV(2);
    this.sprite.setUDepart(0);
    this.sprite.setULimite(2);
    this.sprite.setGrille(4, 8);
    this.sprite.setTaille(tailleReference * 2, tailleReference, 0.1);

    if (!isWayGauche) {
      this.sprite.plusPosition(-tailleReference, 0, 0);
    } else {
      this.sprite.plusPosition(tailleReference, 0, 0);
    }
  }

  activeMelee(isWayGauche) {
    this.soundMelee.pause();
    this.soundMelee.currentTime = 0;
    this.soundMelee.play(1);

    this.sprite.setV(2);
    this.sprite.setGrille(4, 4);
    this.sprite.setUV(0, 2);
    this.sprite.setSpeed(100);
    this.sprite.setAnim();

    this.animMelee(isWayGauche);
  }

  animMelee(isWayGauche) {
    this.sprite.setUDepart(0);
    this.sprite.setULimite(3);
    this.sprite.setTaille(4, 4, 0.1);
    if (isWayGauche) {
      this.sprite.plusPosition(-2, 2, 0);
    } else {
      this.sprite.plusPosition(2, 2, 0);
    }
  }

  animAim() {
    this.sprite.setUDepart(6);
    this.sprite.setULimite(7);
    this.sprite.setU(6);

    this.soundShoot.pause();
    this.soundShoot.currentTime = 0;
  }

  animShoot() {
    this.soundShoot.play(1);
  }

  getAmmunation() {
    return this.ammunation;
  }
}
