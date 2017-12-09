export default class PersoMechant extends Perso {
  constructor() {
    super();
    this.texture = new Texture();
    this.oldAffine = false;
    this.oldVitesseY = 0;

    this.soundDamage = null;
  }

  setup() {
    this.texture.setup(this.cheminTexture);
    Perso.prototype.setup.call(this);
    this.sprite.setSpeed(200);
    this.sprite.setMode(1);
    this.sprite.setGrille(8, 8);
    this.sprite.setUVLimite(2, 1);
    this.sprite.setUV(0, 0);

    this.soundDamage = document.getElementById('sound_damage');
  }
}

draw(camera, program, objet);
{
  if (this.texture.isReady()) {
    program.setTexture(this.texture.get());
  }
  Perso.prototype.draw.call(this, camera, program, objet);
}

/*////// UPDATE ////////////////////////////////*/

update(comportement, input);
{
  Perso.prototype.update.call(this, comportement);

  var isWayGauche = comportement.getWayGauche();
  Perso.prototype.animOrientation.call(this, isWayGauche);

  this.animation(comportement);
}

animation(comportement);
{
  if (!comportement.getDead()) {
    var isAffine = comportement.getAffine();
    var vitesse = comportement.getVitesse();

    if (!isAffine && vitesse.y < 0) {
      if (this.oldVitesseY <= 0) {
        this.sprite.setUVDepart(2, 0);
        this.sprite.setUVLimite(4, 1);
      } // first
    } else {
      this.sprite.setUVDepart(0, 0);
      this.sprite.setUVLimite(2, 1);
    }

    if (comportement.getHit()) {
      this.soundDamage.pause();
      this.soundDamage.currentTime = 0;
      this.soundDamage.play(1);
    }

    // damage
    if (comportement.getDamaged()) {
      this.sprite.setU(4);
    }

    this.oldAffine = isAffine;
    this.oldVitesseY = vitesse.y;
  } else {
    // dead
    var tailleReference = comportement.getTailleReference();
    this.sprite.setMode(0);
    this.sprite.setGrille(4, 8);
    this.sprite.setUV(3, 0);
    this.sprite.setTaille(tailleReference * 2, tailleReference, 0.1);
  }
}
