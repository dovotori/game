export default class Terrain {
  constructor() {
    this.dimensions = [128, 128];
    this.tailleCarre = 2.0;
    this.hauteurMax = 100.0;
    this.texture;
    this.textureN;
    this.vbo;
    this.vboID;
    this.program = new Program();
    this.isLoaded = false;
    this.programInit = false;
    this.model = new Mat4();
    this.nbPoints = 0;
    this.hauteurs = null;

    this.textureSol = new Array(4);
  }

  setup() {
    this.program.setup(path + 'shader/terrain');
    this.model.identity();

    var nomsTex = ['land1Low.jpg', 'neigeLow.jpg', 'land2Low.jpg', 'herbeLow.jpg'];
    for (var i = 0; i < this.textureSol.length; i++) {
      this.textureSol[i] = new Texture();
      this.textureSol[i].setup(path + 'texture/' + nomsTex[i]);
    }

    this.genererHeightMap();
    this.genererNormalMap();

    this.isLoaded = true;
  }

  genererHeightMap() {
    this.setupTextures();

    this.hauteurs = new Array(this.dimensions[0]);
    for (var i = 0; i < this.dimensions[0]; i++) {
      this.hauteurs[i] = new Array(this.dimensions[1]);
    }

    var points = [this.dimensions[0] * this.dimensions[1] * 3]; // XYZ
    var indices = [(this.dimensions[0] - 1) * (this.dimensions[1] - 1) * 6]; // 3 point par triangle et deux triangles par carre
    var cptPt = 0;
    var cptRVBA = 0;
    var cptID = 0;

    var b = new ArrayBuffer(this.dimensions[0] * this.dimensions[1] * 4); // RVBA
    var pixel = new Uint8Array(b);

    for (var z = 0; z < this.dimensions[1]; z++) {
      for (var x = 0; x < this.dimensions[0]; x++) {
        //var relX = x/(this.dimensions[0]-1); var relZ = z/(this.dimensions[1]-1); // grille va de 0 a 1 pour la texture
        var relX = x * this.tailleCarre;
        var relZ = z * this.tailleCarre;

        // POINTS
        points[cptPt] = relX;
        points[cptPt + 1] = 0;
        points[cptPt + 2] = relZ;
        //console.log(points[cptPt]+" / "+points[cptPt+1]+" / "+points[cptPt+2]);

        cptPt += 3;

        // INDICES
        if (x < this.dimensions[0] - 1 && z < this.dimensions[1] - 1) {
          var i = z * this.dimensions[0] + x;

          // premier triangle
          indices[cptID] = i;
          indices[cptID + 1] = i + this.dimensions[0];
          indices[cptID + 2] = i + 1;
          //console.log(indices[cptID]+" / "+indices[cptID+1]+" / "+indices[cptID+2]);

          // deuxieme triangle
          indices[cptID + 3] = i + 1;
          indices[cptID + 4] = i + this.dimensions[0];
          indices[cptID + 5] = i + this.dimensions[0] + 1;
          //console.log(indices[cptID+3]+" / "+indices[cptID+4]+" / "+indices[cptID+5]);

          cptID += 6;
        }

        this.hauteurs[x][z] = perlinNoise(x, z, 100); // entre 0 et 1

        // TEXTURE
        pixel[cptRVBA] = pixel[cptRVBA + 1] = pixel[cptRVBA + 2] = this.hauteurs[x][z] * 255;
        pixel[cptRVBA + 3] = 255;
        cptRVBA += 4;
      }
    }

    this.nbPoints = indices.length;

    // MESH
    this.vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    // INDICES
    this.vboID = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vboID);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    // TEXTURE
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      this.dimensions[0],
      this.dimensions[1],
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      pixel,
    );
    gl.bindTexture(gl.TEXTURE_2D, null);
  }

  genererNormalMap() {
    // CALCUL DES NORMALS PAR FACE TRIANGULAIRE
    var normales = [];
    var cpt = 0;
    var sizeX = this.tailleCarre; //1.0/this.dimensions[0];
    var sizeZ = this.tailleCarre; //1.0/this.dimensions[1];
    for (var z = 0; z < this.dimensions[1] - 1; z++) {
      for (var x = 0; x < this.dimensions[0] - 1; x++) {
        // premier triangle
        var v1 = new Vec3(0, this.hauteurs[x][z] * this.hauteurMax, 0);
        var v2 = new Vec3(0, this.hauteurs[x][z + 1] * this.hauteurMax, sizeX);
        var v3 = new Vec3(sizeX, this.hauteurs[x + 1][z] * this.hauteurMax, 0);
        normales[cpt] = v1.calculerNormale(v2, v3, false);

        // deuxieme triangle
        v1 = new Vec3(sizeX, this.hauteurs[x + 1][z] * this.hauteurMax, 0);
        v2 = new Vec3(0, this.hauteurs[x][z + 1] * this.hauteurMax, sizeZ);
        v3 = new Vec3(sizeX, this.hauteurs[x + 1][z + 1] * this.hauteurMax, sizeZ);
        normales[cpt + 1] = v1.calculerNormale(v2, v3, false);

        cpt += 2;
      }
    }

    // PUIS AFFECTER L'ADDITION DES NORMALS POUR CHAQUE VERTEX
    var b = new ArrayBuffer(this.dimensions[0] * this.dimensions[1] * 4); // RVBA
    var pixel = new Uint8Array(b);
    var cptRVBA = 0;
    var i = 0;
    for (var z = 0; z < this.dimensions[1]; z++) {
      for (var x = 0; x < this.dimensions[0]; x++) {
        var normale;
        //////////////////////////////
        /////////// COIN /////////////
        /////////////////////////////
        // COIN HAUT GAUCHE
        if (x == 0 && z == 0) {
          normale = normales[0];
          normale.normaliser();
          normale = normale.multiplierValeur(0.5);
          normale = normale.plusValeur(0.5);
          pixel[cptRVBA] = normale.x * 255;
          pixel[cptRVBA + 1] = normale.y * 255;
          pixel[cptRVBA + 2] = normale.z * 255;
          pixel[cptRVBA + 3] = 255;
          cptRVBA += 4;
          /*console.log("coin haut gauche");
				console.log(0);
				console.log("///////////////////");*/
          // COIN BAS GAUCHE
        } else if (x == 0 && z == this.dimensions[1] - 1) {
          var normale1 = normales[(this.dimensions[0] - 1) * (this.dimensions[1] - 2) * 2];
          var normale2 = normales[(this.dimensions[0] - 1) * (this.dimensions[1] - 2) * 2 + 1];
          normale = normale1.plus(normale2);
          normale.normaliser();
          normale = normale.multiplierValeur(0.5);
          normale = normale.plusValeur(0.5);
          pixel[cptRVBA] = normale.x * 255;
          pixel[cptRVBA + 1] = normale.y * 255;
          pixel[cptRVBA + 2] = normale.z * 255;
          pixel[cptRVBA + 3] = 255;
          cptRVBA += 4;
          /*console.log("coin bas gauche");
				console.log((((this.dimensions[0]-1)*(this.dimensions[1]-2))*2));
				console.log((((this.dimensions[0]-1)*(this.dimensions[1]-2))*2)+1);
				console.log("///////////////////");*/
          // COIN BAS DROIT
        } else if (x == this.dimensions[0] - 1 && z == this.dimensions[1] - 1) {
          normale = normales[normales.length - 1];
          normale.normaliser();
          normale = normale.multiplierValeur(0.5);
          normale = normale.plusValeur(0.5);
          pixel[cptRVBA] = normale.x * 255;
          pixel[cptRVBA + 1] = normale.y * 255;
          pixel[cptRVBA + 2] = normale.z * 255;
          pixel[cptRVBA + 3] = 255;
          cptRVBA += 4;
          /*console.log("coin bas droit");
				console.log(normales.length-1);
				console.log("///////////////////");*/
          // COIN HAUT DROIT
        } else if (x == this.dimensions[0] - 1 && z == 0) {
          var normale1 = normales[(this.dimensions[0] - 1) * 2 - 1];
          var normale2 = normales[(this.dimensions[0] - 1) * 2 - 2];
          normale = normale1.plus(normale2);
          normale.normaliser();
          normale = normale.multiplierValeur(0.5);
          normale = normale.plusValeur(0.5);
          pixel[cptRVBA] = normale.x * 255;
          pixel[cptRVBA + 1] = normale.y * 255;
          pixel[cptRVBA + 2] = normale.z * 255;
          pixel[cptRVBA + 3] = 255;
          cptRVBA += 4;
          /*console.log("coin haut droit");
				console.log(((this.dimensions[0]-1)*2)-1);
				console.log(((this.dimensions[0]-1)*2)-2);
				console.log("///////////////////");*/
          //////////////////////////////
          /////////// BORD /////////////
          /////////////////////////////
          // BORD HAUT
        } else if (z == 0) {
          var normale1 = normales[x * 2];
          var normale2 = normales[x * 2 - 1];
          var normale3 = normales[x * 2 - 2];
          normale = normale1.plus(normale2);
          normale = normale.plus(normale3);
          normale.normaliser();
          normale = normale.multiplierValeur(0.5);
          normale = normale.plusValeur(0.5);
          pixel[cptRVBA] = normale.x * 255;
          pixel[cptRVBA + 1] = normale.y * 255;
          pixel[cptRVBA + 2] = normale.z * 255;
          pixel[cptRVBA + 3] = 255;
          cptRVBA += 4;
          /*console.log("bord haut");
				console.log((x*2));
				console.log((x*2)-1);
				console.log((x*2)-2);
				console.log("///////////////////");*/
          // BORD GAUCHE
        } else if (x == 0) {
          var normale1 = normales[z * ((this.dimensions[0] - 1) * 2)];
          var normale2 = normales[(z - 1) * ((this.dimensions[0] - 1) * 2)];
          var normale3 = normales[(z - 1) * ((this.dimensions[0] - 1) * 2) + 1];
          normale = normale1.plus(normale2);
          normale = normale.plus(normale3);
          normale.normaliser();
          normale = normale.multiplierValeur(0.5);
          normale = normale.plusValeur(0.5);
          pixel[cptRVBA] = normale.x * 255;
          pixel[cptRVBA + 1] = normale.y * 255;
          pixel[cptRVBA + 2] = normale.z * 255;
          pixel[cptRVBA + 3] = 255;
          cptRVBA += 4;
          /*console.log("bord gauche");
				console.log(z*((this.dimensions[0]-1)*2));
				console.log((z-1)*((this.dimensions[0]-1)*2));
				console.log(((z-1)*((this.dimensions[0]-1)*2))+1);
				console.log("///////////////////");*/
          // BORD DROIT
        } else if (x == this.dimensions[0] - 1) {
          var normale1 = normales[z * ((this.dimensions[0] - 1) * 2) - 1];
          var normale2 = normales[(z + 1) * ((this.dimensions[0] - 1) * 2) - 1];
          var normale3 = normales[(z + 1) * ((this.dimensions[0] - 1) * 2) - 2];
          normale = normale1.plus(normale2);
          normale = normale.plus(normale3);
          normale.normaliser();
          normale = normale.multiplierValeur(0.5);
          normale = normale.plusValeur(0.5);
          pixel[cptRVBA] = normale.x * 255;
          pixel[cptRVBA + 1] = normale.y * 255;
          pixel[cptRVBA + 2] = normale.z * 255;
          pixel[cptRVBA + 3] = 255;
          cptRVBA += 4;
          /*console.log("bord droit");
				console.log((z*((this.dimensions[0]-1)*2))-1);
				console.log(((z+1)*((this.dimensions[0]-1)*2))-1);
				console.log(((z+1)*((this.dimensions[0]-1)*2))-2);
				console.log("///////////////////");*/
          // BORD BAS
        } else if (z == this.dimensions[1] - 1) {
          var normale1 = normales[(z - 1) * ((this.dimensions[0] - 1) * 2) + x * 2];
          var normale2 = normales[(z - 1) * ((this.dimensions[0] - 1) * 2) + x * 2 - 1];
          var normale3 = normales[(z - 1) * ((this.dimensions[0] - 1) * 2) + x * 2 + 1];
          normale = normale1.plus(normale2);
          normale = normale.plus(normale3);
          normale.normaliser();
          normale = normale.multiplierValeur(0.5);
          normale = normale.plusValeur(0.5);
          pixel[cptRVBA] = normale.x * 255;
          pixel[cptRVBA + 1] = normale.y * 255;
          pixel[cptRVBA + 2] = normale.z * 255;
          pixel[cptRVBA + 3] = 255;
          cptRVBA += 4;
          /*console.log("bord bas");
				console.log(((z-1)*((this.dimensions[0]-1)*2))+(x*2));
				console.log(((z-1)*((this.dimensions[0]-1)*2))+(x*2)-1);
				console.log(((z-1)*((this.dimensions[0]-1)*2))+(x*2)+1);
				console.log("///////////////////");*/
          //////////////////////////////
          /////////// MILIEU //////////
          /////////////////////////////
          // MILIEU
        } else {
          var normale1 = normales[(z - 1) * ((this.dimensions[0] - 1) * 2) + x * 2];
          var normale2 = normales[(z - 1) * ((this.dimensions[0] - 1) * 2) + x * 2 - 1];
          var normale3 = normales[(z - 1) * ((this.dimensions[0] - 1) * 2) + x * 2 + 1];
          var normale4 = normales[z * ((this.dimensions[0] - 1) * 2) + x * 2];
          var normale5 = normales[z * ((this.dimensions[0] - 1) * 2) + x * 2 - 1];
          var normale6 = normales[z * ((this.dimensions[0] - 1) * 2) + x * 2 - 2];
          normale = normale1.plus(normale2);
          normale = normale.plus(normale3);
          normale = normale.plus(normale4);
          normale = normale.plus(normale5);
          normale = normale.plus(normale6);
          normale.normaliser();
          normale = normale.multiplierValeur(0.5);
          normale = normale.plusValeur(0.5);
          pixel[cptRVBA] = normale.x * 255;
          pixel[cptRVBA + 1] = normale.y * 255;
          pixel[cptRVBA + 2] = normale.z * 255;
          pixel[cptRVBA + 3] = 255;
          cptRVBA += 4;
          /*console.log("milieu");
				console.log(((z-1)*((this.dimensions[0]-1)*2))+(x*2));
				console.log(((z-1)*((this.dimensions[0]-1)*2))+(x*2)-1);
				console.log(((z-1)*((this.dimensions[0]-1)*2))+(x*2)+1);
				console.log((z*((this.dimensions[0]-1)*2))+(x*2));
				console.log((z*((this.dimensions[0]-1)*2))+(x*2)-1);
				console.log((z*((this.dimensions[0]-1)*2))+(x*2)-2);
				console.log("///////////////////");*/
        }
        //console.log("NORMALE "+i+": "+normale.x+" / "+normale.y+" / "+normale.z);
        i++;
      }
    }

    gl.bindTexture(gl.TEXTURE_2D, this.textureN);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      this.dimensions[0],
      this.dimensions[1],
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      pixel,
    );
    gl.bindTexture(gl.TEXTURE_2D, null);

    //console.log("TRIANGLE: 0 / "+this.hauteurs[x][z]+" / 0 ///// 1 / "+this.hauteurs[x][z+1]+" 0 ///// 0 /"+this.hauteurs[x+1][z]+" / 1");
  }

  setupTextures() {
    this.texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.bindTexture(gl.TEXTURE_2D, null);

    this.textureN = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.textureN);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.bindTexture(gl.TEXTURE_2D, null);
  }

  draw(camera, lampe, haveCameraView) {
    if (this.program.isReady() && this.textureSol[0].isReady()) {
      // DRAW DEPTHMAP FROM LAMPE??
      var view = camera.getView().transpose();
      if (haveCameraView != null) {
        view = lampe.getViewMatrix().transpose();
      }

      this.model.push();
      var normalmatrix = new Mat3();
      normalmatrix.set(this.model.getMatrice3x3());
      this.program.setMatrices(
        camera.getProjection().transpose(),
        this.model.transpose(),
        view,
        normalmatrix.transpose(),
      );
      this.model.pop();

      if (!this.programInit) {
        this.program.setNormalTexture(this.textureN);
        this.program.setNoiseTexture(this.texture);
        this.program.setHeightmapAmplitude(this.hauteurMax);
        this.program.setSpriteGrille(this.getTailleTerrain());
        for (var i = 0; i < this.textureSol.length; i++) {
          this.program.setTex(this.textureSol[i].get(), i + 3);
        }
      } else {
        this.programInit = true;
      }

      this.program.setShadowMatrix(lampe.getViewMatrix().transpose());
      this.program.setTex(lampe.getDepthTexture(), 7);
      this.program.setBrillance(20.0);
      this.program.setLumiere(lampe.getPosition().get(), camera.getPosition().get());

      gl.useProgram(this.program.get());

      if (this.program.get().vLoc > -1) {
        gl.enableVertexAttribArray(this.program.get().vLoc);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        gl.vertexAttribPointer(this.program.get().vLoc, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vboID);
      }

      gl.drawElements(gl.TRIANGLES, this.nbPoints, gl.UNSIGNED_SHORT, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }
  }

  setLumiere(camera, lampePos) {
    if (this.program.isReady()) {
      this.program.setLumiere(lampePos, camera.getPosition().get());
    }
  }

  getHauteur(x, z) {
    var x = x / (this.dimensions[0] * this.tailleCarre);
    var z = z / (this.dimensions[1] * this.tailleCarre);

    var largeurCarreGrille = 1.0 / (this.dimensions[0] - 1);
    var longueurCarreGrille = 1.0 / (this.dimensions[1] - 1);

    // quel carre de la grille
    var grilleX = Math.floor(x / largeurCarreGrille);
    var grilleZ = Math.floor(z / longueurCarreGrille);

    // if hors du terrain
    if (x < 0 || x >= 1 || z < 0 || z >= 1) {
      return 0;
    }

    // position entre 0 et 1 sur le carre
    var posCarreX = (x % largeurCarreGrille) / largeurCarreGrille;
    var posCarreZ = (z % longueurCarreGrille) / longueurCarreGrille;

    // quel triangle
    var resultat;
    if (posCarreX <= 1 - posCarreZ) {
      // triangle haut gauche
      var v1 = new Vec3(0, this.hauteurs[grilleX][grilleZ], 0);
      var v2 = new Vec3(1, this.hauteurs[grilleX + 1][grilleZ], 0);
      var v3 = new Vec3(0, this.hauteurs[grilleX][grilleZ + 1], 1);
      resultat = Vec3.getBarycentre(v1, v2, v3, [posCarreX, posCarreZ]);

      //console.log(this.hauteurs[grilleX][grilleZ]+" / "+this.hauteurs[grilleX+1][grilleZ]+" / "+this.hauteurs[grilleX+1][grilleZ]+" // "+resultat);
    } else {
      // triangle bas droite
      var v1 = new Vec3(0, this.hauteurs[grilleX][grilleZ + 1], 1);
      var v2 = new Vec3(1, this.hauteurs[grilleX + 1][grilleZ], 0);
      var v3 = new Vec3(1, this.hauteurs[grilleX + 1][grilleZ + 1], 1);
      resultat = Vec3.getBarycentre(v1, v2, v3, [posCarreX, posCarreZ]);
    }
    //console.log(grilleX+"/"+grilleZ+" -> "+resultat);
    return (resultat - 0.5) * 2.0 * this.hauteurMax;
  }

  setTailleCarre(value) {
    this.tailleCarre = value;
  }
  setDimensions(w, h) {
    this.dimensions = [w, h];
  }
  setHauteurMax(value) {
    this.hauteurMax = value;
  }

  getTailleTerrain() {
    return [this.dimensions[0] * this.tailleCarre, this.dimensions[1] * this.tailleCarre];
  }
  getHauteurMax() {
    return this.hauteurMax;
  }
  getHalfSizeX() {
    return this.dimensions[0] * this.tailleCarre / 2.0;
  }
}
