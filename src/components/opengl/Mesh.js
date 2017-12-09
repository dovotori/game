export default class Mesh {
  constructor() {
    this.position = new Vec3(0, 0, 0);
    this.rotation = new Vec3(0, 0, 0);
    this.taille = new Vec3(1, 1, 1);
    this.ambiant = new Vec3(0, 0, 1);
    this.diffuse = new Vec3(0.4, 0.4, 0.4);
    this.specular = new Vec3(1.0, 1.0, 1.0);
    this.brillance = 60.0;
    this.opacity = 1.0;
    this.model = new Mat4();
  }

  setup() {
    this.model.identity();
  }

  draw(camera, program, objet) {
    if (program.isReady() && objet.isReady()) {
      this.model.push();
      this.model.translate(this.position.x, this.position.y, this.position.z);
      this.model.scale(this.taille.x, this.taille.y, this.taille.z);
      this.model.rotate(this.rotation.x, 1, 0, 0);
      this.model.rotate(this.rotation.y, 0, 1, 0);
      this.model.rotate(this.rotation.z, 0, 0, 1); 

      var normalmatrix = new Mat3();
      normalmatrix.set(this.model.getMatrice3x3()); 

      program.setMatrices(
        camera.getProjection().transpose(),
        this.model.transpose(),
        camera.getView().transpose(),
        normalmatrix.transpose(),
      );
      program.setCouleurs(this.ambiant.get(), this.diffuse.get(), this.specular.get());
      program.setOpacity(this.opacity);
      program.setBrillance(this.brillance); 

      objet.draw(program.get()); 

      this.model.pop();
    }
  }


drawFlat(camera, program, objet) {
  if (program.isReady() && objet.isReady()) {
    var matID = camera.getMatriceIdentity(); 

    this.model.push();
    this.model.translate(this.position.x, this.position.y, this.position.z);
    this.model.scale(this.taille.x, this.taille.y, this.taille.z);
    this.model.rotate(this.rotation.x, 1, 0, 0);
    this.model.rotate(this.rotation.y, 0, 1, 0);
    this.model.rotate(this.rotation.z, 0, 0, 1); 

    var normalmatrix = new Mat3();
    normalmatrix.set(this.model.getMatrice3x3());
    //normalmatrix.inverser();

    program.setMatrices(
      matID.transpose(),
      this.model.transpose(),
      matID.transpose(),
      normalmatrix.get(),
    );
    program.setCouleurs(
      this.ambiant.get(),
      this.diffuse.get(),
      this.specular.get(),
      this.opacity,
      this.brillance,
    );

    objet.draw(program.get()); 

    this.model.pop();
  }
}

setPosition(x, y, z) {
  this.position.set(x, y, z);
}
setTaille(x, y, z) {
  this.taille.set(x, y, z);
}
setRotation(x, y, z) {
  this.rotation.set(x, y, z);
}
setAmbiant(x, y, z) {
  this.ambiant.set(x / 255, y / 255, z / 255);
}
setDiffuse(x, y, z) {
  this.diffuse.set(x / 255, y / 255, z / 255);
}
setSpecular(x, y, z) {
  this.specular.set(x / 255, y / 255, z / 255);
}
setBrillance(valeur) {
  this.brillance = valeur;
}
setOpacity(valeur) {
  this.opacity = valeur;
}

plusPosition(x, y, z) {
  var ajout = new Vec3(x, y, z);
  this.position = this.position.plus(ajout);
}

getPosition() {
  return this.position;
}
getTaille() {
  return this.taille;
}
getRotation() {
  return this.rotation;
}
}
