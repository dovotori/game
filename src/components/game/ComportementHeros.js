export default class ComportementHeros extends Comportement {
  constructor() {
    super();

    this.auPlafond = false;
    this.isDash = false;
    this.isShoot = false;
    this.isAim = false;
    this.isMelee = false;
    this.isRunned = false;
  }

  setup() {
    Comportement.prototype.setup.call(this);
    this.taille.set(this.tailleReference, this.tailleReference, 0.1);
  }

  update(tilemap) {
    this.rebondirPlafond();
    this.applyGravity(); // important gravite d'abord
    Comportement.prototype.update.call(this, tilemap);
  }

  rebondirPlafond() {
    if (this.auPlafond) {
      this.vitesse.y -= 1.0;
      this.auPlafond = false;
    }
  }

  collisionBasse(x, y, tileSize, map, mapSize) {
    var largeur = this.taille.x;
    if (this.isDash) {
      largeur = this.tailleReference * 2;
    } // ne tombe pas lors du dash

    var coinGauche, coinDroit, coinBas;
    coinGauche = Math.floor(x / tileSize[0]);
    coinDroit = Math.floor((x + largeur * 2) / tileSize[0]);
    coinBas = Math.floor((y - this.taille.y * 2) / tileSize[1]) * -1.0 - 1.0;

    //var limiteMapY = ((mapSize[1]) * tileSize[1]) - (this.taille.y*2);

    this.checkEtat(map[coinGauche][coinBas], map[coinDroit][coinBas], 1, 1);

    if (map[coinGauche][coinBas] <= 0 || map[coinDroit][coinBas] <= 0) {
      return true;
    } else if (this.taille.x > tileSize[0] / 2) {
      // perso trop large, on calcule des points intermediaires
      for (var i = coinGauche; i < coinDroit; i += Math.round(tileSize[0] / 4)) {
        if (map[i][coinBas] <= 0) {
          this.isAffine = true;
          return true;
        }
      }
      return false;
    } else {
      // libre
      return false;
    }
  }

  checkEtat(coinBasGauche, coinBasDroit, coinHautGauche, coinHautDroit) {
    Comportement.prototype.checkEtat.call(
      this,
      coinBasGauche,
      coinBasDroit,
      coinHautGauche,
      coinHautDroit,
    );

    // PLAFOND
    if (coinHautGauche <= 0 || coinHautDroit <= 0) {
      // touche
      this.auPlafond = true;
    } else if (coinHautGauche > 0 && coinHautDroit > 0) {
      // en l'air
      this.auPlafond = false;
    }
  }

  /*////// INTERACTION ////////////////////////////////*/

  interaction(input) {
    if (input.getClavier(78)) {
      // melee
      input.setClavier(78);
      this.isMelee = true;
      this.isAim = false;
    } else if (input.getClavier(66)) {
      // viser
      this.isAim = true;
      this.isMelee = false;
      this.vitesse.x = 0.0;
    } else {
      if (this.isAim) {
        // shooter
        this.isShoot = true;
      } else {
        this.isShoot = false;
        this.gaucheDroite(input);
        this.sauter(input);
        this.dash(input);
      }
      this.isAim = false;
      this.isMelee = false;
    }
  }

  gaucheDroite(input) {
    var vitesse = 0.9;
    if (input.getClavier(37) && input.getClavier(39)) {
      this.vitesse.x = 0;
      this.isRunned = false;
    } else if (input.getClavier(37)) {
      this.vitesse.x = -vitesse;
      this.isWayGauche = true;
      if (this.isAffine) {
        this.isRunned = true;
      } else {
        this.isRunned = false;
      }
    } else if (input.getClavier(39)) {
      this.vitesse.x = vitesse;
      this.isWayGauche = false;
      if (this.isAffine) {
        this.isRunned = true;
      } else {
        this.isRunned = false;
      }
    } else {
      this.vitesse.x = 0;
      this.isRunned = false;
    }
  }

  dash(input) {
    var vitesse = 4.0;

    if (this.isAffine && input.getClavier(32) && (input.getClavier(37) || input.getClavier(39))) {
      this.isDash = true;
      if (input.getClavier(37)) {
        this.vitesse.x = -vitesse;
      }
      if (input.getClavier(39)) {
        this.vitesse.x = vitesse;
      }
    } else {
      this.isDash = false;
    }
  }

  sauter(input) {
    if (input.getClavier(38) && this.isAffine) {
      input.setClavier(38);
      this.vitesse.y += 1.7;
      this.isAffine = false;
    }
  }

  /*////// GETTEURS / SETTEURS ////////////////////////////////*/
  getPlafond() {
    return this.auPlafond;
  }
  getDash() {
    return this.isDash;
  }
  getShoot() {
    return this.isShoot;
  }
  getAim() {
    return this.isAim;
  }
  getMelee() {
    return this.isMelee;
  }
  getRun() {
    return this.isRunned;
  }

  setDash(bool) {
    this.isDash = bool;
  }
}
