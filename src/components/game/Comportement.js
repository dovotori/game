export default class Comportement {
  constructor() {
    this.positionCentree = new Vec3();
    this.position = new Vec3();
    this.vitesse = new Vec3();
    this.taille = new Vec3();

    this.isAffine = false;
    this.isBlockGauche = false;
    this.isBlockDroite = false;

    this.isWayGauche = false;
    this.timeTransitionDamage = 4;
    this.transitionDamage = new Transition();
    this.life = 10;
    this.isDead = false;

    this.tailleReference = 1.9;
  }

  setup() {
    this.positionCentree.set(0, 0, 0);
    this.position.set(1, 0, 0);
    this.vitesse.set(0, 0, 0);
    this.taille.set(1.9, 1.9, 0.1);
  }

  update(tilemap) {
    this.updateTilemap(tilemap);
  }

  applyGravity() {
    var gravite = 0.09;
    if (!this.isAffine) {
      this.vitesse.y -= gravite;
    } else {
      this.vitesse.y = -gravite;
    }
  }

  updateTilemap(tilemap) {
    if (tilemap.isReady()) {
      var tileSize = tilemap.getTileSize();
      var map = tilemap.getMap();
      var mapSize = tilemap.getMapSize();
      var scrollSize = tilemap.getScrollSize();
      var scrollPos = tilemap.getScrollPos();

      this.deplacement(this.vitesse.x, this.vitesse.y, tileSize, map, mapSize);

      // centrer sur l'ecran
      var decalageX = scrollSize[0] * tileSize[0] / 2.0;
      var decalageY = scrollSize[1] * tileSize[1] / 2.0;

      // decalage pour rectMode CORNER
      this.positionCentree.set(
        this.position.x + this.taille.x - scrollPos[0] - decalageX,
        this.position.y - this.taille.y + scrollPos[1] + decalageY,
        0.2,
      );

      if (this.position.y < -(mapSize[1] * tileSize[1])) {
        this.position.y = 10.0;
      } // si tombe tu reviens en haut
    }
  }

  deplacement(vx, vy, tileSize, map, mapSize) {
    // vitesse plus grande que le tile
    if (vx >= tileSize[0] || vy >= tileSize[1]) {
      this.deplacement(vx / 2, vy / 2, tileSize, map, mapSize);
      this.deplacement(vx - vx / 2, vy - vy / 2, tileSize, map, mapSize); // on decompose le mouvement en 2
      return;
    }

    // precision pour l'affinage
    var precisionAffinage = 0.01;

    // pour x
    if (this.essaiX(vx, tileSize, map, mapSize) == 1) {
      this.position.x += vx;
    } else {
      // affinage
      if (Math.abs(vx) > precisionAffinage) {
        for (var i = 0; i < Math.abs(vx); i += precisionAffinage) {
          if (this.essaiX(signe(vx) * precisionAffinage, tileSize, map, mapSize) == 1) {
            this.position.x += signe(vx) * precisionAffinage;
          }
        }
      }
    }

    // pour y
    if (this.essaiY(this.position, vy, this.taille, tileSize, map, mapSize) == 1) {
      this.position.y += vy;
    } else {
      // affinage
      if (Math.abs(vy) > precisionAffinage) {
        for (var i = 0; i < Math.abs(vy); i += precisionAffinage) {
          if (this.essaiY(signe(vy) * precisionAffinage, tileSize, map, mapSize) == 1) {
            this.position.y += signe(vy) * precisionAffinage;
          }
        }
      }
    }
  }

  essaiX(vx, tileSize, map, mapSize) {
    var copix = this.position.x;
    copix += vx;
    if (vx > 0) {
      if (this.collisionDroite(copix, this.position.y, tileSize, map, mapSize) == 1) {
        return 0;
      } else {
        return 1;
      }
    } else if (vx < 0) {
      if (this.collisionGauche(copix, this.position.y, tileSize, map, mapSize) == 1) {
        return 0;
      } else {
        return 1;
      }
    } else {
      return 0;
    }
  }

  essaiY(vy, tileSize, map, mapSize) {
    var copiy = this.position.y;
    copiy += vy;
    if (vy > 0) {
      if (this.collisionHaute(this.position.x, copiy, tileSize, map, mapSize) == 1) return 0;
      else return 1;
    } else if (vy < 0) {
      if (this.collisionBasse(this.position.x, copiy, tileSize, map, mapSize) == 1) return 0;
      else return 1;
    } else {
      return 0;
    }
  }

  collisionDroite(x, y, tileSize, map, mapSize) {
    var coinHaut, coinDroit, coinBas;
    coinDroit = Math.floor((x + this.taille.x * 2) / tileSize[0]);
    coinHaut = Math.floor(y / tileSize[1]) * -1.0 - 1.0;
    coinBas = Math.floor((y - this.taille.y * 2) / tileSize[1]) * -1.0 - 1.0;

    // verification si la position est dans la map pour le coin droit
    if (map[coinDroit] != null) {
      this.isBlockDroite = false;
      //var limiteMapX = ((mapSize[0]) * tileSize[0]) - (this.taille.x*2) - 1.0;

      this.checkEtat(1, map[coinDroit][coinBas], 1, map[coinDroit][coinHaut]);

      if (map[coinDroit][coinBas] <= 0 || map[coinDroit][coinHaut] <= 0) {
        return true;
      } else if (this.taille.y > tileSize[1] / 2) {
        // perso trop haut, on calcule des points intermediaires
        for (var i = coinHaut; i < coinBas; i += Math.round(tileSize[1] / 4)) {
          if (map[coinDroit][i] <= 0) {
            this.isAffine = true;
            return true;
          }
        }
        return false;
      } else {
        // libre
        return false;
      }
    } else {
      this.isBlockDroite = true;
      // on bloque le cote droit de la map
      return true;
    }
  }

  collisionGauche(x, y, tileSize, map, mapSize) {
    var coinGauche, coinHaut, coinBas;
    coinGauche = Math.floor(x / tileSize[0]);
    coinHaut = Math.floor(y / tileSize[1]) * -1.0 - 1.0;
    coinBas = Math.floor((y - this.taille.y * 2) / tileSize[1]) * -1.0 - 1.0;

    // verification si la position est dans la map pour le coin gauche
    if (map[coinGauche] != null) {
      this.isBlockGauche = false;
      //var limiteMapX = ((mapSize[0]) * tileSize[0]) - (this.taille.x*2) - 1.0;

      this.checkEtat(map[coinGauche][coinBas], 1, map[coinGauche][coinHaut], 1);

      if (map[coinGauche][coinBas] <= 0 || map[coinGauche][coinHaut] <= 0) {
        return true;
      } else if (this.taille.y > tileSize[1] / 2) {
        // perso trop haut, on calcule des points intermediaires
        for (var i = coinHaut; i < coinBas; i += Math.round(tileSize[1] / 4)) {
          if (map[coinGauche][i] <= 0) {
            this.isAffine = true;
            return true;
          }
        }
        return false;
      } else {
        // libre
        return false;
      }
    } else {
      this.isBlockGauche = true;
      // on bloque le cote gauche de la map
      return true;
    }
  }

  collisionHaute(x, y, tileSize, map, mapSize) {
    var coinGauche, coinHaut, coinDroit;
    coinGauche = Math.floor(x / tileSize[0]);
    coinDroit = Math.floor((x + this.taille.x * 2) / tileSize[0]);
    coinHaut = Math.floor(y / tileSize[1]) * -1.0 - 1.0;

    //var limiteMapY = ((mapSize[1]) * tileSize[1]) - (this.taille.y*2);

    this.checkEtat(1, 1, map[coinGauche][coinHaut], map[coinDroit][coinHaut]);

    if (map[coinGauche][coinHaut] <= 0 || map[coinDroit][coinHaut] <= 0) {
      return true;
    } else if (this.taille.x > tileSize[0] / 2) {
      // perso trop large, on calcule des points intermediaires
      for (var i = coinGauche; i < coinDroit; i += Math.round(tileSize[0] / 4)) {
        if (map[i][coinHaut] <= 0) {
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

  collisionBasse(x, y, tileSize, map, mapSize) {
    var coinGauche, coinDroit, coinBas;
    coinGauche = Math.floor(x / tileSize[0]);
    coinDroit = Math.floor((x + this.taille.x * 2) / tileSize[0]);
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
    // SOL
    if (coinBasGauche <= 0 || coinBasDroit <= 0) {
      // touche
      this.isAffine = true;
    } else if (coinBasGauche > 0 && coinBasDroit > 0) {
      // chute
      this.isAffine = false;
    }

    // Gauche Droite Stop
    if (coinBasGauche <= 0 && coinHautGauche <= 0) {
      this.isBlockGauche = true;
    }
    if (coinBasDroit <= 0 && coinHautDroit <= 0) {
      this.isBlockDroite = true;
    }
  }

  /*////// GETTEURS / SETTEURS ////////////////////////////////*/
  getPositionCentree() {
    return this.positionCentree;
  }
  getPosition() {
    return this.position;
  }
  getVitesse() {
    return this.vitesse;
  }
  getTaille() {
    return this.taille;
  }
  getTailleReference() {
    return this.tailleReference;
  }
  getAffine() {
    return this.isAffine;
  }
  getWayGauche() {
    return this.isWayGauche;
  }
  getDamaged() {
    return !this.transitionDamage.isFinished;
  }
  getLife() {
    return this.life;
  }
  getDead() {
    return this.isDead;
  }

  setPosition(pos) {
    this.position.egale(pos);
  }
  setWayGauche(bool) {
    this.isWayGauche = bool;
  }
  setVitesseX(valeur) {
    this.vitesse.x = valeur;
  }
  setVitesseY(valeur) {
    this.vitesse.y = valeur;
  }
}
