export default class Tilemap {
  constructor() {
    this.map = null;
    this.mapSize = new Array(2);
    this.tileSize = new Array(2);

    this.scrollPos = new Array(2);
    this.scrollSize = new Array(2);

    this.boxPos = new Array(2);
    this.boxSize = new Array(2);
    this.isLoaded = false;

    this.sprite = new Sprite();
    this.colortexture = new Texture();
    this.normaltexture = new Texture();

    this.decalageEcran = new Array(2);

    this.cheminTexture = 'texture/tex.png';
    this.cheminNormalTexture = 'texture/tex.png';

    this.segments = null;
  }

  setup(nomFichier) {
    this.tileSize[0] = 4.0;
    this.tileSize[1] = 4.0;

    this.scrollPos[0] = 0.0;
    this.scrollPos[1] = 0.0;
    this.scrollSize[0] = 20.0;
    this.scrollSize[1] = 10.0;

    this.boxPos[0] = this.scrollSize[0] * this.tileSize[0] / 2.0;
    this.boxPos[1] = this.scrollSize[1] * this.tileSize[1] / 2.0;

    // box pour activer le scroll
    this.boxSize[0] = 1.0;
    this.boxSize[1] = 1.0;

    // centrer sur l'ecran
    this.decalageEcran[0] = this.scrollSize[0] * this.tileSize[0] / 2.0;
    this.decalageEcran[1] = this.scrollSize[1] * this.tileSize[1] / 2.0;

    var image = new Image();
    var clone = this;
    image.addEventListener(
      'load',
      function () {
        clone.loadMap(image);
      },
      false,
    );
    image.src = nomFichier;

    this.colortexture.setup(this.cheminTexture);
    this.normaltexture.setup(this.cheminNormalTexture);

    this.sprite.setup();
    this.sprite.setRotation(90, 0, 180);
    this.sprite.setMode(0);
    this.sprite.setGrille(4, 4);
  }

  loadMap(image) {
    this.mapSize[0] = image.width;
    this.mapSize[1] = image.height;

    this.map = new Array(image.width);
    for (var i = 0; i < this.map.length; i++) {
      this.map[i] = new Array(image.height);
    }

    context.drawImage(image, 0, 0);

    var data;
    for (var y = 0; y < image.height; y++) {
      for (var x = 0; x < image.width; x++) {
        data = context.getImageData(x, y, 1, 1).data;
        // collision
        if (data[0] == 0 && data[1] == 0 && data[2] == 0) {
          this.map[x][y] = 0;
        } else if (data[0] == 0 && data[1] == 0 && data[2] == 255) {
          this.map[x][y] = -1;
        } else if (data[0] == 150 && data[1] == 150 && data[2] == 150) {
          this.map[x][y] = -2;
          // deco
        } else if (data[0] == 255 && data[1] == 0 && data[2] == 0) {
          this.map[x][y] = 2;
        } else if (data[0] == 0 && data[1] == 255 && data[2] == 0) {
          this.map[x][y] = 3;
        } else if (data[0] == 0 && data[1] == 200 && data[2] == 0) {
          this.map[x][y] = 4;
        } else if (data[0] == 0 && data[1] == 180 && data[2] == 0) {
          this.map[x][y] = 5;
        } else if (data[0] == 0 && data[1] == 160 && data[2] == 0) {
          this.map[x][y] = 6;
        } else if (data[0] == 0 && data[1] == 140 && data[2] == 0) {
          this.map[x][y] = 7;
          // rien
        } else {
          this.map[x][y] = 1;
        }
      }
    }

    this.isLoaded = true;
  }

  /*////////// DRAW ////////////////////////////////////////*/

  draw(camera, programBump, programSprite, objet) {
    if (this.isLoaded) {
      // limites du scroll
      var xmin, xmax, ymin, ymax;
      xmin = Math.floor(this.scrollPos[0] / this.tileSize[0]);
      xmax = Math.floor(this.scrollPos[0] / this.tileSize[0] + this.scrollSize[0]);
      ymin = Math.floor(this.scrollPos[1] / this.tileSize[1]);
      ymax = Math.floor(this.scrollPos[1] / this.tileSize[1] + this.scrollSize[1]);

      this.segments = new Array();
      // ajout du conteneur
      this.addSegments(
        -this.decalageEcran[0] * 2.0,
        this.decalageEcran[1] * 3.0,
        this.scrollSize[0] * this.tileSize[0] * 2.0,
        this.scrollSize[1] * this.tileSize[1] * 3.0,
      );

      for (var y = ymin; y < ymax; y++) {
        for (var x = xmin; x < xmax; x++) {
          var xCentre = x * this.tileSize[0] - this.scrollPos[0] - this.decalageEcran[0];
          var yCentre = -y * this.tileSize[1] + this.scrollPos[1] + this.decalageEcran[1];

          var xCoinHautGauche = xCentre + this.tileSize[0] / 2.0;
          var yCoinHautGauche = yCentre - this.tileSize[1] / 2.0;

          if (this.map[x][y] == 0) {
            // collision violet
            this.sprite.setGrille(8, 8);
            this.sprite.setUV(Math.floor(random(2, 3)), 0);
            //this.sprite.setUV(Math.floor(random(4,8)), Math.floor(random(0,4)));
            this.drawTile(
              camera,
              programBump,
              objet,
              xCoinHautGauche,
              yCoinHautGauche,
              0,
              200,
              255,
              0,
            );
          } else if (this.map[x][y] == -1) {
            // collision carre
            this.sprite.setGrille(8, 8);
            this.sprite.setUV(0, 0);
            this.drawTile(
              camera,
              programBump,
              objet,
              xCoinHautGauche,
              yCoinHautGauche,
              0,
              0,
              255,
              200,
            );
            this.addSegments(xCentre, yCentre, this.tileSize[0], this.tileSize[1]);
          } else if (this.map[x][y] == -2) {
            // collision electrique
            this.sprite.setGrille(8, 8);
            this.sprite.setUV(random(4, 7), random(0, 3));
            this.drawTile(
              camera,
              programSprite,
              objet,
              xCoinHautGauche,
              yCoinHautGauche,
              0,
              0,
              255,
              200,
            );
          } else if (this.map[x][y] == 2) {
            // decor
            this.sprite.setGrille(8, 8);
            this.sprite.setUV(1, 0);
            this.drawTile(
              camera,
              programSprite,
              objet,
              xCoinHautGauche,
              yCoinHautGauche,
              0,
              0,
              255,
              200,
            );
          } else if (this.map[x][y] == 3) {
            // decor
            this.sprite.setGrille(8, 8);
            this.sprite.setUV(1, 1);
            this.drawTile(
              camera,
              programSprite,
              objet,
              xCoinHautGauche,
              yCoinHautGauche,
              0,
              0,
              255,
              200,
            );
          } else if (this.map[x][y] == 4) {
            // decor
            this.sprite.setGrille(8, 8);
            this.sprite.setUV(0, 2);
            this.drawTile(
              camera,
              programSprite,
              objet,
              xCoinHautGauche,
              yCoinHautGauche,
              0,
              0,
              255,
              200,
            );
          } else if (this.map[x][y] == 5) {
            // decor
            this.sprite.setGrille(8, 8);
            this.sprite.setUV(1, 2);
            this.drawTile(
              camera,
              programSprite,
              objet,
              xCoinHautGauche,
              yCoinHautGauche,
              0,
              0,
              255,
              200,
            );
          } else if (this.map[x][y] == 6) {
            // decor
            this.sprite.setGrille(8, 8);
            this.sprite.setUV(0, 1);
            this.drawTile(
              camera,
              programSprite,
              objet,
              xCoinHautGauche,
              yCoinHautGauche,
              0,
              0,
              255,
              200,
            );
          } else if (this.map[x][y] == 7) {
            // decor
            this.sprite.setGrille(8, 8);
            this.sprite.setUV(0, 3);
            this.drawTile(
              camera,
              programSprite,
              objet,
              xCoinHautGauche,
              yCoinHautGauche,
              0,
              0,
              255,
              200,
            );
          } else {
            // rien
            //this.sprite.setGrille(8, 8);
            //this.sprite.setUV(0, 0);
            //this.drawTile(camera, program, objet, x,-y,0, 0,255,200);
          }
        }
      }
    }
  }

  drawTile(camera, program, objet, x, y, z, r, v, b) {
    this.sprite.setAmbiant(r, v, b);

    this.sprite.setPosition(x, y, z);

    this.sprite.setTaille(this.tileSize[0] / 2.0, this.tileSize[1] / 2.0, 0.1);
    if (this.colortexture.isReady()) {
      program.setTexture(this.colortexture.get());
    }
    if (this.normaltexture.isReady()) {
      program.setNormalTexture(this.normaltexture.get());
    }
    this.sprite.draw(camera, program, objet);
  }

  /*//////// UPDATE /////////////////////////////////////*/

  update(comportement) {
    var comportementPos = comportement.getPosition();

    var boxMinX, boxMaxX, boxMinY, boxMaxY;
    boxMinX = this.scrollPos[0] + this.boxPos[0];
    boxMaxX = boxMinX + this.boxSize[0];
    boxMinY = -this.scrollPos[1] - this.boxPos[1];
    boxMaxY = boxMinY - this.boxSize[1];

    if (comportementPos.x < boxMinX) this.scrollPos[0] -= boxMinX - comportementPos.x;
    if (comportementPos.x > boxMaxX) this.scrollPos[0] += comportementPos.x - boxMaxX;
    if (comportementPos.y > boxMinY) this.scrollPos[1] += boxMinY - comportementPos.y;
    if (comportementPos.y < boxMaxY) this.scrollPos[1] -= comportementPos.y - boxMaxY;

    // CLAMPING Collision extremite
    if (this.scrollPos[0] < 0) {
      this.scrollPos[0] = 0;
    } else if (
      this.scrollPos[0] >
      this.mapSize[0] * this.tileSize[0] - this.scrollSize[0] * this.tileSize[0]
    ) {
      this.scrollPos[0] =
        this.mapSize[0] * this.tileSize[0] - this.scrollSize[0] * this.tileSize[0];
    }
    if (this.scrollPos[1] < 0) {
      this.scrollPos[1] = 0;
    } else if (
      this.scrollPos[1] >
      this.mapSize[1] * this.tileSize[1] - this.scrollSize[1] * this.tileSize[1]
    ) {
      this.scrollPos[1] =
        this.mapSize[1] * this.tileSize[1] - this.scrollSize[1] * this.tileSize[1];
    }
  }

  addSegments(x, y, w, h) {
    // haut
    this.segments.push({ a: { x: x, y: y }, b: { x: x + w, y: y } });
    // droit
    this.segments.push({ a: { x: x + w, y: y }, b: { x: x + w, y: y - h } });
    // bas
    this.segments.push({ a: { x: x + w, y: y - h }, b: { x: x, y: y - h } });
    // gauche
    this.segments.push({ a: { x: x, y: y - h }, b: { x: x, y: y } });
  }

  getScrollPos() {
    return this.scrollPos;
  }
  getScrollSize() {
    return this.scrollSize;
  }
  getMapSize() {
    return this.mapSize;
  }
  getTileSize() {
    return this.tileSize;
  }
  getMap() {
    return this.map;
  }
  getSegments() {
    return this.segments;
  }
  isReady() {
    return this.isLoaded;
  }

  setCheminTexture(chemin) {
    this.cheminTexture = chemin;
  }
  setCheminNormalTexture(chemin) {
    this.cheminNormalTexture = chemin;
  }
}
