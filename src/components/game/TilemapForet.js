export default class TilemapForet extends Tilemap {
  constructor() {
    super();
    this.foret = new Sprite();
    this.spritesForet = new Texture();
    this.spritesForetNormal = new Texture();
    this.fboForet = new Framebuffer();
    this.fboNormalForet = new Framebuffer();
    this.scene = new Mesh();
    this.drawOnce = false;

    this.resolutionScene = 4.0;
    this.scaleScene = 6.0;

    this.cheminTextureForet = 'texture/tex.png';
    this.cheminNormalTextureForet = 'texture/tex.png';
  }

  setup(nomFichier) {
    Tilemap.prototype.setup.call(this, nomFichier);

    this.spritesForet.setFiltre(gl.LINEAR);
    this.spritesForet.setup(this.cheminTextureForet);
    this.spritesForetNormal.setFiltre(gl.LINEAR);
    this.spritesForetNormal.setup(this.cheminNormalTextureForet);

    this.foret.setup();
    this.foret.setRotation(90, 0, 0);
    this.foret.setGrille(8, 8);
    this.foret.setUV(0, 0);

    this.scene.setup();
    this.scene.setRotation(90, 180, 0);
  }

  loadMap(image) {
    Tilemap.prototype.loadMap.call(this, image);
    this.fboForet.setup(
      canvas3d.width * this.resolutionScene,
      canvas3d.height * this.resolutionScene,
    );
    this.fboNormalForet.setup(
      canvas3d.width * this.resolutionScene,
      canvas3d.height * this.resolutionScene,
    );
  }

  drawForetFBO(camera, program, objet) {
    if (
      this.isLoaded &&
      !this.drawOnce &&
      this.spritesForet.isReady() &&
      this.spritesForetNormal.isReady()
    ) {
      gl.viewport(
        0,
        0,
        canvas3d.width * this.resolutionScene,
        canvas3d.height * this.resolutionScene,
      );
      gl.clearColor(0.0, 0.0, 0.0, 0.0);
      this.fboForet.beginDraw();

      for (var y = 0; y < this.map[0].length; y++) {
        for (var x = 0; x < this.map.length; x++) {
          if (this.map[x][y] == 0) {
            this.foret.setV(0);
            this.drawForetTile(camera, program, objet, x, y);
          }
        }
      }

      this.fboForet.endDraw();

      this.drawOnce = true;
      gl.viewport(0, 0, canvas3d.width, canvas3d.height);
      gl.clearColor(53.0 / 255.0, 50.0 / 255.0, 50.0 / 255.0, 1.0);
    }
  }

  drawForetTile(camera, program, objet, x, y) {
    var xScale = x * this.tileSize[0] / this.scaleScene;
    var yScale = -(y * this.tileSize[1]) / this.scaleScene;

    var hasard = random(0.4, 2.4);
    var wTile = this.tileSize[0] / 2.0 / this.scaleScene;
    var hTile = this.tileSize[1] / 2.0 / this.scaleScene;

    var wTileHasard = wTile * hasard;
    var hTileHasard = hTile * hasard;

    this.foret.setTaille(wTileHasard, hTileHasard, 0.1);
    this.foret.setPosition(xScale, yScale + hTileHasard - hTile, 0.0);
    this.foret.setU(Math.round(random(0, 7)));

    this.fboForet.switchDraw();
    program.setTexture(this.spritesForet.get());
    this.foret.draw(camera, program, objet);

    this.fboNormalForet.switchDraw();
    program.setTexture(this.spritesForetNormal.get());
    this.foret.draw(camera, program, objet);
  }

  drawForetScene(camera, program, objet) {
    if (this.drawOnce) {
      program.setTexture(this.fboForet.getTexture());
      program.setNormalTexture(this.fboNormalForet.getTexture());
      program.setBrillance(2.0);

      var coef = 0.0777; // mystere à determiner

      var w = canvas3d.width * coef * this.scaleScene;
      var h = canvas3d.height * coef * this.scaleScene;

      var x = -this.decalageEcran[0] + this.tileSize[0] / 2.0;
      var y = this.decalageEcran[1] + this.tileSize[1] / 2.0;

      x -= this.scrollPos[0];
      y += this.scrollPos[1];

      this.scene.setPosition(x, y, -0.01);

      this.scene.setTaille(w, h, 0.1);
      this.scene.draw(camera, program, objet);
    }
  }

  setCheminTextureForet(chemin) {
    this.cheminTextureForet = chemin;
  }
  setCheminNormalTextureForet(chemin) {
    this.cheminNormalTextureForet = chemin;
  }
}
