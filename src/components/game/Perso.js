export default class Perso {
  constructor() {
    this.sprite = new Sprite();
    this.cheminTexture = 'texture/tex.png';
  }

  setup() {
    this.sprite.setup();
    this.sprite.setRotation(90, 0, 180);
  }

  draw(camera, program, objet) {
    this.sprite.draw(camera, program, objet);
  }

  update(comportement) {
    var position = comportement.getPositionCentree();
    var taille = comportement.getTaille();
    this.sprite.setPosition(position.x, position.y, position.z);
    this.sprite.setTaille(taille.x, taille.y, taille.z);
  }

  animOrientation(isWayGauche) {
    if (isWayGauche) {
      this.sprite.setRotation(90, 0, 0);
    } else {
      this.sprite.setRotation(90, 0, 180);
    }
  }

  setCheminTexture(chemin) {
    this.cheminTexture = chemin;
  }
}
