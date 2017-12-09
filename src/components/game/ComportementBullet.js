export default class ComportementBullet extends Comportement {
  constructor() {
    super();
    this.speed = 5.0;
    this.isAim = false;
    this.isShoot = false;
    this.isHit = false;
    this.direction = 1;
  }

  setup() {
    Comportement.prototype.setup.call(this);
    this.taille.set(1, 1, 0.1);
  }

  update(tilemap) {
    if (!this.isAim) {
      this.vitesse.x = this.speed * this.direction;
      if (this.isBlockGauche || this.isBlockDroite) {
        this.activeHit();
      }
    }
    Comportement.prototype.update.call(this, tilemap);
  }

  activeAim(isWayGauche) {
    this.isWayGauche = isWayGauche;
    this.isAim = true;
    this.isShoot = false;
    this.isHit = false;
    if (this.isWayGauche) {
      this.direction = -1;
    } else {
      this.direction = 1;
    }
    this.isBlockGauche = false;
    this.isBlockDroite = false;
  }

  activeShoot() {
    this.isShoot = true;
    this.isAim = false;
    this.isHit = false;
  }

  activeHit() {
    this.isShoot = false;
    this.isHit = true;
  }

  collisionPerso(perso) { }

  getAim() {
    return this.isAim;
  }
  getShoot() {
    return this.isShoot;
  }
  getHit() {
    return this.isHit;
  }

  setAim(valeur) {
    this.isAim = valeur;
  }
  setShoot(valeur) {
    this.isShoot = valeur;
  }
}
