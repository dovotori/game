export default class Particules {
  constructor() {
    this.lifesTime = null;
    this.mesh = new Mesh();
    this.positions = null;
    this.nbParticules = 40;

    this.origine = new Vec3(0, 0, 0);
    this.direction = new Vec3(-1, 0, 0);
    this.vitesse = 0.2;
    this.lifeTimeMax = 10.0;
  }

  setup() {
    this.origine.set(0, 0, -10);

    this.positions = new Array(this.nbParticules);
    this.lifesTime = new Array(this.nbParticules);
    for (var i = 0; i < this.nbParticules; i++) {
      this.positions[i] = new Vec3(0, 0, this.origine.z);
      this.lifesTime[i] = map(i, 0, this.nbParticules, 0, this.lifeTimeMax);
    }
    this.mesh.setup();
    this.mesh.setOpacity(0.1);
    this.mesh.setAmbiant(150.0, 150.0, 150.0);
  }

  draw(camera, program, objet, persoPos) {
    program.setLumiere(persoPos.get(), camera.getPosition().get());

    this.updatePosition();

    for (var i = 0; i < this.nbParticules; i++) {
      this.updateParticule(i);
      this.mesh.setPosition(this.positions[i].x, this.positions[i].y, this.positions[i].z);

      var taille = map(this.lifesTime[i], 0, this.lifeTimeMax, 0.1, 4.0);
      this.mesh.setTaille(taille, taille, taille);

      this.mesh.setRotation(
        this.origine.x * this.lifesTime[i],
        this.origine.x * this.lifesTime[i],
        0.0,
      );

      this.mesh.draw(camera, program, objet);
    }
  }

  updatePosition() {
    if (this.origine.x > 80.0 || this.origine.x < -80.0) {
      this.vitesse *= -1.0;
      this.origine.y = random(-20.0, 20.0);
      //this.direction.x = this.direction.x*(-1.0);
    }
    this.origine.x += this.vitesse;
  }

  updateParticule(particule) {
    this.lifesTime[particule] -= 1;
    //this.positions[particule] = this.positions[particule].plus(this.direction);
    this.positions[particule].x += random(-2, 2);
    this.positions[particule].y += random(-2, 2);

    if (this.lifesTime[particule] < 0) {
      this.resetParticule(particule);
    }
  }

  resetParticule(particule) {
    this.positions[particule].egale(this.origine);
    this.lifesTime[particule] = this.lifeTimeMax;
  }

  setOrigine(x, y, z) {
    this.origine.set(x, y, z);
  }
  setDirection(x, y, z) {
    this.direction.set(x, y, z);
  }

  plusOrigine(x, y, z) {
    var ajout = new Vec3(x, y, z);
    this.origine = this.origine.plus(ajout);
  }
}
