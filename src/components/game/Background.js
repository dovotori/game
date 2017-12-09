export default class Background {
  constructor() {
    this.mesh = new Mesh();
    this.texture = new Texture();
    this.cheminTexture = 'texture/tex.png';
  }

  setup() {
    this.mesh.setup();
    this.mesh.setRotation(90, 135, 0);
    this.mesh.setTaille(60, 60, 1);
    this.mesh.setPosition(0, 0, 0);
    this.mesh.setOpacity(0.5);
    this.texture.setup(this.cheminTexture);
  }

  draw(camera, program, objet) {
    if (this.texture.isReady()) {
      program.setTexture(this.texture.get());
      this.mesh.draw(camera, program, objet);
    }
  }

  update(tilemap, parallax, profondeur, ajoutX, ajoutY) {
    var scrollPos = tilemap.getScrollPos();
    var scrollSize = tilemap.getScrollSize();
    var tileSize = tilemap.getTileSize();
    var mouvX =
      map(scrollPos[0], 0, scrollSize[0] * (tileSize[0] / 2), parallax, -parallax) + ajoutX;
    var mouvY =
      map(scrollPos[1], 0, scrollSize[1] * (tileSize[1] / 2), -parallax, parallax) + ajoutY;
    this.mesh.setPosition(mouvX, mouvY, profondeur);
  }

  plusPosition(x, y, z) {
    this.mesh.plusPosition(x, y, z);
  }
  setPosition(x, y, z) {
    this.mesh.setPosition(x, y, z);
  }
  setCheminTexture(chemin) {
    this.cheminTexture = chemin;
  }
}
