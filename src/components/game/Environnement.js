export default class Environnement {
  constructor() {
    this.objets = Array(3);
    this.model = new Mat4();
    this.program = new Program();
    this.positions = Array(100);
    this.infos = Array(this.positions.length); // type, scale, rotation
  }

  setup(terrain) {
    this.program.setup(path + 'shader/phong');
    this.model.identity();

    for (var i = 0; i < this.objets.length; i++) {
      this.objets[i] = new Objet();
    }

    this.objets[0].setup(path + 'objet/house.obj');
    this.objets[1].setup(path + 'objet/arbre.obj');
    this.objets[2].setup(path + 'objet/rocher.obj');

    this.positions[0] = [140, terrain.getHauteur(140, 90) + 6.9, 90];
    this.infos[0] = [0, 16, 90]; // maison
    for (var i = 1; i < this.positions.length; i++) {
      if (i < this.positions.length / 2) {
        // arbre
        var x = random(0, 260);
        var z = random(0, 260);
        this.positions[i] = [x, terrain.getHauteur(x, z) - 0.2, z];
        this.infos[i] = [1, random(1, 2), random(0, 360)];
      } else {
        // rocher
        var x = random(0, 260);
        var z = random(0, 260);
        this.positions[i] = [x, terrain.getHauteur(x, z) - 0.2, z];
        this.infos[i] = [2, random(0.2, 4), random(0, 360)];
      }
    }
  }

  draw(camera, lampe, haveCameraView) {
    if (
      this.program.isReady() &&
      this.objets[0].isReady() &&
      this.objets[1].isReady() &&
      this.objets[2].isReady()
    ) {
      // DRAW DEPTHMAP FROM LAMPE??
      var view = camera.getView().transpose();
      if (haveCameraView != null) {
        view = lampe.getViewMatrix().transpose();
      }

      this.program.setOpacity(1);
      this.program.setBrillance(60.0);
      var a = new Vec3(0.5, 0.5, 0.7);
      var d = new Vec3(1.0, 1.0, 0.0);
      var s = new Vec3(1.0, 1.0, 1.0);
      this.program.setCouleurs(a.get(), d.get(), s.get());
      this.program.setLumiere(lampe.getPosition().get(), camera.getPosition().get());

      for (var i = 0; i < this.positions.length; i++) {
        this.model.push();

        this.model.translate(this.positions[i][0], this.positions[i][1], this.positions[i][2]);
        this.model.scale(this.infos[i][1], this.infos[i][1], this.infos[i][1]);
        this.model.rotate(this.infos[i][2], 0, 1, 0);
        var normalmatrix = new Mat3();
        normalmatrix.set(this.model.getMatrice3x3());
        this.program.setMatrices(
          camera.getProjection().transpose(),
          this.model.transpose(),
          view, //camera.getView().transpose(),
          normalmatrix.transpose(),
        );
        this.model.pop();
        this.objets[this.infos[i][0]].draw(this.program.get());
      }
    }
  }
}
