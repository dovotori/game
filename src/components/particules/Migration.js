export default class Migration {
  constructor() {
    this.oiseaux;
    this.nbOiseaux = 10;
    this.cpt = 0;
  }

  setup() {
    this.oiseaux = [];
    for (var i = 0; i < this.nbOiseaux; i++) {
      this.oiseaux[i] = new Oiseau();
      this.oiseaux[i].setup(200, 200, 200);
    }
  }

  draw() {
    for (var i = 0; i < this.nbOiseaux; i++) {
      this.oiseaux[i].updateTroupeau(this.oiseaux);
      //this.oiseaux[i].draw();
      this.oiseaux[i].respawnBordures(400, 400, 400);
    }
  }

  update() { }

  getOiseaux() {
    return this.oiseaux;
  }
  setNbOiseaux(valeur) {
    this.nbOiseaux = valeur;
  }

  setDistanceSeparation(valeur) {
    Oiseau.distanceSeparation = valeur;
  }
  setDistanceAlignement(valeur) {
    Oiseau.distanceAlignement = valeur;
  }
  setDistanceCohesion(valeur) {
    Oiseau.distanceCohesion = valeur;
  }
  setVitesseMax(valeur) {
    Oiseau.vitesseMax = valeur;
  }
}
