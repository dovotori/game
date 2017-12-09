export default class Objet {
  constructor() {
    this.nbPoints = 0;
    this.modeDessin = gl.TRIANGLES; // gl.LINES // gl.TRIANGLES // gl.LINE_STRIP // gl.LINE_LOOP
    this.modeCalcul = gl.STATIC_DRAW; // STATIC_DRAW -> change pas // DYNAMIC_DRAW -> repete // STREAM_DRAW -> une fois au moins
    this.points = new Array(5);
    this.vbo = new Array(5);
    for (var i = 0; i < 5; i++) {
      this.points[i] = null;
      this.vbo[i] = null;
    }
    this.isLoaded = false;
  }

  setup(chemin) {
    loadFile(chemin, this.apply.bind(this));
  }
  setupIndex(chemin) {
    loadFile(chemin, this.applyIndex.bind(this));
  }

  apply(data) {
    var obj = new LoadObj(data);
    this.points[0] = obj.getVertices();
    this.points[1] = obj.getNormales();
    this.points[2] = obj.getTextures();
    //this.points[3] = obj.getVerticesDecale1();
    //this.points[4] = obj.getVerticesDecale2();
    this.nbPoints = obj.getNbFaces() * 3;

    // VERTICE
    this.vbo[0] = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo[0]);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.points[0]), this.modeCalcul);

    // NORMALES
    this.vbo[1] = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo[1]);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.points[1]), this.modeCalcul);

    // TEXTURES
    this.vbo[2] = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo[2]);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.points[2]), this.modeCalcul);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    this.isLoaded = true;
  }

  applyIndex(data) {
    var obj = new LoadObj(data);
    this.points[0] = obj.getPureVertices();
    this.points[1] = obj.getNormales();
    this.points[2] = obj.getTextures();
    //this.points[3] = obj.getVerticesDecale1();
    //this.points[4] = obj.getVerticesDecale2();
    this.points[3] = obj.getIdVertices();
    //this.nbPoints = obj.getNbFaces() * 3;
    this.nbPoints = this.points[3].length;

    // VERTICE
    this.vbo[0] = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo[0]);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.points[0]), this.modeCalcul);

    // NORMALES
    this.vbo[1] = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo[1]);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.points[1]), this.modeCalcul);

    // TEXTURES
    this.vbo[2] = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo[2]);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.points[2]), this.modeCalcul);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    // INDICES
    this.vbo[3] = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vbo[3]);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.points[3]), this.modeCalcul);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    this.isLoaded = true;
  }

  setupCustom(points) {
    this.vbo[0] = gl.createBuffer();
    this.nbPoints = 0;
    if (points != null) {
      this.updateBuffer(points);
    }
    this.isLoaded = true;
  }

  setupFlat() {
    var points = [-1, -1, 0, 1, -1, 0, -1, 1, 0, 1, 1, 0, 1, -1, 0, -1, 1, 0];
    this.setupCustom(points);
  }

  setupGrid(longueur, largeur) {
    var nbPoints = longueur * largeur;
    var points = [nbPoints * 6 * 3]; // 2 triangles de 3 coordonnees XYZ
    var cpt = 0;

    var stepX = 1.0 / longueur;
    var stepY = 1.0 / largeur; // grille va de 0 a d pour la texture

    for (var y = 0; y < largeur - 1; y++) {
      for (var x = 0; x < longueur - 1; x++) {
        var relX = x * stepX;
        var relY = y * stepY;

        // first triangle
        points[cpt] = relX;
        points[cpt + 1] = relY;
        points[cpt + 2] = 0;
        points[cpt + 3] = relX + stepX;
        points[cpt + 4] = relY;
        points[cpt + 5] = 0;
        points[cpt + 6] = relX;
        points[cpt + 7] = relY + stepY;
        points[cpt + 8] = 0;

        // second triangle
        points[cpt + 9] = relX + stepX;
        points[cpt + 10] = relY;
        points[cpt + 11] = 0;
        points[cpt + 12] = relX + stepX;
        points[cpt + 13] = relY + stepY;
        points[cpt + 14] = 0;
        points[cpt + 15] = relX;
        points[cpt + 16] = relY + stepY;
        points[cpt + 17] = 0;

        cpt += 18;
      }
    }

    this.setupCustom(points);
  }

  draw(program) {
    gl.useProgram(program);

    if (program.vLoc > -1 && this.points[0] != null) {
      gl.enableVertexAttribArray(program.vLoc);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo[0]);
      gl.vertexAttribPointer(program.vLoc, 3, gl.FLOAT, false, 0, 0);
    }

    if (program.nLoc > -1 && this.points[1] != null) {
      gl.enableVertexAttribArray(program.nLoc);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo[1]);
      gl.vertexAttribPointer(program.nLoc, 3, gl.FLOAT, false, 0, 0);
    }

    if (program.tLoc > -1 && this.points[2] != null) {
      gl.enableVertexAttribArray(program.tLoc);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo[2]);
      gl.vertexAttribPointer(program.tLoc, 2, gl.FLOAT, false, 0, 0);
    }

    if (program.cLoc > -1 && this.points[3] != null) {
      gl.enableVertexAttribArray(program.cLoc);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo[3]);
      gl.vertexAttribPointer(program.cLoc, 3, gl.FLOAT, false, 0, 0);
    }

    gl.drawArrays(this.modeDessin, 0, this.nbPoints);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    gl.useProgram(null);
  }

  drawIndex(program) {
    gl.useProgram(program);

    if (program.vLoc > -1 && this.points[0] != null) {
      gl.enableVertexAttribArray(program.vLoc);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo[0]);
      gl.vertexAttribPointer(program.vLoc, 3, gl.FLOAT, false, 0, 0);
    }

    if (program.nLoc > -1 && this.points[1] != null) {
      gl.enableVertexAttribArray(program.nLoc);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo[1]);
      gl.vertexAttribPointer(program.nLoc, 3, gl.FLOAT, false, 0, 0);
    }

    if (program.tLoc > -1 && this.points[2] != null) {
      gl.enableVertexAttribArray(program.tLoc);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo[2]);
      gl.vertexAttribPointer(program.tLoc, 2, gl.FLOAT, false, 0, 0);
    }

    if (program.cLoc > -1 && this.points[3] != null) {
      gl.enableVertexAttribArray(program.cLoc);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo[3]);
      gl.vertexAttribPointer(program.cLoc, 3, gl.FLOAT, false, 0, 0);
    }

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vbo[3]);
    gl.drawElements(this.modeDessin, this.nbPoints, gl.UNSIGNED_SHORT, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    gl.useProgram(null);
  }

  updateBuffer(points) {
    this.points[0] = points;
    this.nbPoints = points.length / 3.0;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo[0]);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.points[0]), this.modeCalcul);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }

  setCustomTexture(points) {
    this.points[2] = points;
    // COULEURS
    if (this.points[2] != null) {
      this.vbo[2] = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo[2]);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.points[2]), this.modeCalcul);
    }
  }

  setCustomCouleur(points) {
    this.points[3] = points;
    // COULEURS
    if (this.points[3] != null) {
      this.vbo[3] = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo[3]);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.points[3]), this.modeCalcul);
    }
  }

  updateCouleurs(points) {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo[3]);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.points[3]), this.modeCalcul);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }

  isReady() {
    return this.isLoaded;
  }
  setModeDessin(mode) {
    this.modeDessin = mode;
  }
  setModeCalcul(mode) {
    this.modeCalcul = mode;
  }
}
