export default class {
  constructor() {
    this.cube = new Objet()
    this.programRepere = new Program()
    this.model = new Mat4()
    this.positionRepere = new Vec3(128, 1.0, 128)
  }

  setup() {
    this.model.identity()
    this.cube.setupIndex(path + "objet/cube.obj")
    this.programRepere.setup(path + "shader/basique")
  }

  draw(camera) {
    if (this.programRepere.isReady() && this.cube.isReady()) {
      var repPos = new Vec3()
      repPos.egale(camera.getPosition())
      var rayon = camera.getEyeDirection() //this.mousePicker.getRayon();
      rayon = rayon.multiplierValeur(2.0)
      repPos = repPos.plus(rayon)
      //*
      // REPERE
      this.model.push()
      //this.model.translate(this.positionRepere.x, this.positionRepere.y, this.positionRepere.z);
      //this.model.translate(this.lampe.getPosition().x, this.lampe.getPosition().y, this.lampe.getPosition().z);
      this.model.translate(repPos.x, repPos.y, repPos.z)
      this.model.scale(0.1, 0.1, 0.1)
      this.programRepere.setMatrices(
        camera.getProjection().transpose(),
        this.model.transpose(),
        camera.getView().transpose(),
      )
      this.model.pop()
      this.cube.drawIndex(this.programRepere.get())
      //*/
    }
  }

  update() {
    var vitesse = 0.6

    if (this.input.getClavier(38) || this.input.getClavier(90)) {
      this.positionRepere.z -= vitesse //on avance
    }
    if (this.input.getClavier(40) || this.input.getClavier(83)) {
      this.positionRepere.z += vitesse //on recule
    }
    if (this.input.getClavier(37) || this.input.getClavier(81)) {
      this.positionRepere.x -= vitesse //on se déplace sur la gauche
    }
    if (this.input.getClavier(39) || this.input.getClavier(68)) {
      this.positionRepere.x += vitesse //on se déplace sur la droite
    }
    this.positionRepere.y = this.terrain.getHauteur(
      this.positionRepere.x,
      this.positionRepere.z,
    )
  }
}
