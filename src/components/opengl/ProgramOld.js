export default class Program {
  constructor() {
    this.program = null;
    this.isLoaded = false;
    this.nomFichier;
    this.isLoaded;
  }

  setup(nomFichierVertex, nomFichierFragment) {
    this.nomFichier = nomFichierVertex;
    if (nomFichierFragment != null) {
      this.nomFichier = nomFichierFragment;
    }
    this.isLoaded = false;
    this.program = gl.createProgram();
    var cheminVertex = nomFichierVertex + '.vertex';
    loadFile(cheminVertex, this.apply.bind(this)); // permet de recuperer instance de classe dans le callback
  }

  apply(data) {
    this.creerShader('vertex', data);
    var cheminPixel = this.nomFichier + '.pixel';
    loadFile(cheminPixel, this.secondApply.bind(this));
  }

  secondApply(data) {
    this.creerShader('fragment', data);
    gl.linkProgram(this.program);
    gl.useProgram(this.program);
    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      alert('Ne peux pas lier le shader au program');
      gl.deleteProgram(this.program);
      return;
    }
    this.creerLocations();
    this.isLoaded = true;
  }

  creerShader(type, source) {
    var s = gl.createShader(type == 'vertex' ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER);
    gl.shaderSource(s, source);
    gl.compileShader(s);

    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      alert('Peux pas compiler ' + type + ' shader:\n\n' + gl.getShaderInfoLog(s));
      gl.deleteShader(s);
      return;
    }

    gl.attachShader(this.program, s);
    gl.deleteShader(s);
  }

  creerLocations() {
    // ATTRIB
    this.program.vLoc = gl.getAttribLocation(this.program, 'Vertice');
    this.program.nLoc = gl.getAttribLocation(this.program, 'Normale');
    this.program.tLoc = gl.getAttribLocation(this.program, 'Texture');
    this.program.cLoc = gl.getAttribLocation(this.program, 'Couleur');
    this.program.vdLoc = gl.getAttribLocation(this.program, 'Decale');
    this.program.vddLoc = gl.getAttribLocation(this.program, 'Decale2');

    // UNIFORM
    this.program.pMatLoc = gl.getUniformLocation(this.program, 'projection');
    this.program.mMatLoc = gl.getUniformLocation(this.program, 'model');
    this.program.vMatLoc = gl.getUniformLocation(this.program, 'view');
    this.program.nMatLoc = gl.getUniformLocation(this.program, 'normalmatrix');
    this.program.sMatLoc = gl.getUniformLocation(this.program, 'shadowview');
    this.program.invProjMatLoc = gl.getUniformLocation(this.program, 'inverseProjection');
    this.program.invViewMatLoc = gl.getUniformLocation(this.program, 'inverseView');

    this.program.posLumLoc = gl.getUniformLocation(this.program, 'posLum');
    this.program.posEyeLoc = gl.getUniformLocation(this.program, 'posEye');
    this.program.dirEyeLoc = gl.getUniformLocation(this.program, 'dirEye');

    this.program.ambiantLoc = gl.getUniformLocation(this.program, 'ambiant');
    this.program.diffuseLoc = gl.getUniformLocation(this.program, 'diffuse');
    this.program.specularLoc = gl.getUniformLocation(this.program, 'specular');
    this.program.opacityLoc = gl.getUniformLocation(this.program, 'opacity');

    this.program.ampliLoc = gl.getUniformLocation(this.program, 'amplitude');
    this.program.ampliLoc2 = gl.getUniformLocation(this.program, 'amplitude2');
    this.program.typeLoc = gl.getUniformLocation(this.program, 'type');
    this.program.brillanceLoc = gl.getUniformLocation(this.program, 'brillance');
    this.program.timeLoc = gl.getUniformLocation(this.program, 'time');
    this.program.freqLoc = gl.getUniformLocation(this.program, 'frequency');
    this.program.blurLoc = gl.getUniformLocation(this.program, 'blurTaille');
    this.program.distDofLoc = gl.getUniformLocation(this.program, 'distanceDOF');
    this.program.nearFarLoc = gl.getUniformLocation(this.program, 'nearFar');

    this.program.colorMapLoc = gl.getUniformLocation(this.program, 'colorMap');
    this.program.normalMapLoc = gl.getUniformLocation(this.program, 'normalMap');
    this.program.depthMapLoc = gl.getUniformLocation(this.program, 'depthMap');
    this.program.blurMapLoc = gl.getUniformLocation(this.program, 'blurMap');
    this.program.specMapLoc = gl.getUniformLocation(this.program, 'specularMap');
    this.program.cubeMapLoc = gl.getUniformLocation(this.program, 'cubeMap');
    this.program.heightMapLoc = gl.getUniformLocation(this.program, 'heightMap');
    this.program.tex0Loc = gl.getUniformLocation(this.program, 'tex0');
    this.program.tex1Loc = gl.getUniformLocation(this.program, 'tex1');
    this.program.tex2Loc = gl.getUniformLocation(this.program, 'tex2');
    this.program.tex3Loc = gl.getUniformLocation(this.program, 'tex3');
    this.program.tex4Loc = gl.getUniformLocation(this.program, 'tex4');
    this.program.tex5Loc = gl.getUniformLocation(this.program, 'tex5');
    this.program.tex6Loc = gl.getUniformLocation(this.program, 'tex6');
    this.program.tex7Loc = gl.getUniformLocation(this.program, 'tex7');

    // OCLUSION
    this.program.noiseMapLoc = gl.getUniformLocation(this.program, 'noiseMap');
    this.program.kernelLoc = gl.getUniformLocation(this.program, 'sampleKernel');
    this.program.kernelSizeLoc = gl.getUniformLocation(this.program, 'kernelSize');
    this.program.rayonLoc = gl.getUniformLocation(this.program, 'rayon');

    // SPRITE
    this.program.spriteGrilleLoc = gl.getUniformLocation(this.program, 'spriteGrille');
    this.program.spriteUVLoc = gl.getUniformLocation(this.program, 'spriteUV');

    // HEIGHTMAP
    this.program.heightmapColorLoc = gl.getUniformLocation(this.program, 'heightmapColor');
    this.program.heightmapAmpliLoc = gl.getUniformLocation(this.program, 'heightmapAmpli');

    this.program.lightDirLoc = gl.getUniformLocation(this.program, 'lightdir');
  }

  setMatrices(projection, model, view, normal) {
    if (this.isLoaded) {
      gl.useProgram(this.program);
      gl.uniformMatrix4fv(this.program.pMatLoc, false, projection);
      gl.uniformMatrix4fv(this.program.mMatLoc, false, model);
      gl.uniformMatrix4fv(this.program.vMatLoc, false, view);
      if (normal != null) {
        gl.uniformMatrix3fv(this.program.nMatLoc, false, normal);
      }
    }
  }

  setShadowMatrix(matrice) {
    if (this.isLoaded) {
      gl.useProgram(this.program);
      gl.uniformMatrix4fv(this.program.sMatLoc, false, matrice);
    }
  }

  setCouleurs(ambiant, diffuse, specular) {
    if (this.isLoaded) {
      gl.useProgram(this.program);
      if (ambiant != null) {
        gl.uniform3fv(this.program.ambiantLoc, ambiant);
      }
      if (diffuse != null) {
        gl.uniform3fv(this.program.diffuseLoc, diffuse);
      }
      if (specular != null) {
        gl.uniform3fv(this.program.specularLoc, specular);
      }
    }
  }

  setTex(texture, id) {
    if (this.isLoaded) {
      // Color Texture
      gl.useProgram(this.program);
      switch (id) {
        case 0:
          gl.activeTexture(gl.TEXTURE0);
          break;
        case 1:
          gl.activeTexture(gl.TEXTURE1);
          break;
        case 2:
          gl.activeTexture(gl.TEXTURE2);
          break;
        case 3:
          gl.activeTexture(gl.TEXTURE3);
          break;
        case 4:
          gl.activeTexture(gl.TEXTURE4);
          break;
        case 5:
          gl.activeTexture(gl.TEXTURE5);
          break;
        case 6:
          gl.activeTexture(gl.TEXTURE6);
          break;
        case 7:
          gl.activeTexture(gl.TEXTURE7);
          break;
      }
      gl.bindTexture(gl.TEXTURE_2D, texture);
      switch (id) {
        case 0:
          gl.uniform1i(this.program.tex0Loc, id);
          break;
        case 1:
          gl.uniform1i(this.program.tex1Loc, id);
          break;
        case 2:
          gl.uniform1i(this.program.tex2Loc, id);
          break;
        case 3:
          gl.uniform1i(this.program.tex3Loc, id);
          break;
        case 4:
          gl.uniform1i(this.program.tex4Loc, id);
          break;
        case 5:
          gl.uniform1i(this.program.tex5Loc, id);
          break;
        case 6:
          gl.uniform1i(this.program.tex6Loc, id);
          break;
        case 7:
          gl.uniform1i(this.program.tex7Loc, id);
          break;
      }
    }
  }

  setTexture(texture) {
    if (this.isLoaded) {
      // Color Texture
      gl.useProgram(this.program);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(this.program.colorMapLoc, 0);
    }
  }

  setNormalTexture(texture) {
    if (this.isLoaded) {
      // Normal Texture
      gl.useProgram(this.program);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(this.program.normalMapLoc, 1);
    }
  }

  setDepthTexture(texture) {
    if (this.isLoaded) {
      // Normal Texture
      gl.useProgram(this.program);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(this.program.depthMapLoc, 1);
    }
  }

  setSpecularTexture(texture) {
    if (this.isLoaded) {
      // Normal Texture
      gl.useProgram(this.program);
      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(this.program.specMapLoc, 2);
    }
  }

  setBlurTexture(texture) {
    if (this.isLoaded) {
      // Normal Texture
      gl.useProgram(this.program);
      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(this.program.blurMapLoc, 2);
    }
  }

  setNoiseTexture(texture) {
    if (this.isLoaded) {
      // Normal Texture
      gl.useProgram(this.program);
      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(this.program.noiseMapLoc, 2);
    }
  }

  setCubeTexture(texture) {
    if (this.isLoaded) {
      // Color Texture
      gl.useProgram(this.program);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
      gl.uniform1i(this.program.cubeMapLoc, 0);
    }
  }

  setHeightmapTexture(texture) {
    if (this.isLoaded) {
      // Color Texture
      gl.useProgram(this.program);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(this.program.heightMapLoc, 1);
    }
  }

  setLumiere(lampePosition, cameraPosition) {
    if (this.isLoaded) {
      gl.useProgram(this.program);
      gl.uniform3fv(this.program.posLumLoc, lampePosition);
      gl.uniform3fv(this.program.posEyeLoc, cameraPosition);
    }
  }

  setSprite(grille, uv) {
    if (this.isLoaded) {
      gl.useProgram(this.program);
      gl.uniform2fv(this.program.spriteGrilleLoc, grille);
      gl.uniform2fv(this.program.spriteUVLoc, uv);
    }
  }

  setSpriteGrille(grille) {
    if (this.isLoaded) {
      gl.useProgram(this.program);
      gl.uniform2fv(this.program.spriteGrilleLoc, grille);
    }
  }

  setOcclusion(samples, size, rayon) {
    if (this.isLoaded) {
      gl.useProgram(this.program);
      gl.uniform3fv(this.program.kernelLoc, samples);
      gl.uniform1i(this.program.kernelSizeLoc, size);
      gl.uniform1f(this.program.rayonLoc, rayon);
    }
  }

  setInverseProjection(inverseProjection) {
    if (this.isLoaded) {
      gl.useProgram(this.program);
      gl.uniformMatrix4fv(this.program.invProjMatLoc, false, inverseProjection);
    }
  }

  setInverseView(inverseView) {
    if (this.isLoaded) {
      gl.useProgram(this.program);
      gl.uniformMatrix4fv(this.program.invViewMatLoc, false, inverseView);
    }
  }

  setHeightmap(color, amplitude) {
    if (this.isLoaded) {
      gl.useProgram(this.program);
      gl.uniform3fv(this.program.heightmapColorLoc, color);
      gl.uniform1f(this.program.heightmapAmpliLoc, amplitude);
    }
  }

  setHeightmapAmplitude(amplitude) {
    if (this.isLoaded) {
      gl.useProgram(this.program);
      gl.uniform1f(this.program.heightmapAmpliLoc, amplitude);
    }
  }

  setSunset(lightDirection) {
    if (this.isLoaded) {
      gl.useProgram(this.program);
      gl.uniform3fv(this.program.lightDirLoc, lightDirection);
    }
  }

  setNearFar(nearfar) {
    if (this.isLoaded) {
      gl.useProgram(this.program);
      gl.uniform2fv(this.program.nearFarLoc, nearfar);
    }
  }

  setWave(time, frequency) {
    if (this.isLoaded) {
      gl.useProgram(this.program);
      gl.uniform1f(this.program.timeLoc, time);
      gl.uniform1f(this.program.freqLoc, frequency);
    }
  }

  setBlur(valeur) {
    if (this.isLoaded) {
      gl.useProgram(this.program);
      gl.uniform1f(this.program.blurLoc, valeur);
    }
  }
  setOpacity(valeur) {
    if (this.isLoaded) {
      gl.useProgram(this.program);
      gl.uniform1f(this.program.opacityLoc, valeur);
    }
  }
  setBrillance(valeur) {
    if (this.isLoaded) {
      gl.useProgram(this.program);
      gl.uniform1f(this.program.brillanceLoc, valeur);
    }
  }
  setDistanceDOF(valeur) {
    if (this.isLoaded) {
      gl.useProgram(this.program);
      gl.uniform1f(this.program.distDofLoc, valeur);
    }
  }

  get() {
    return this.program;
  }
  isReady() {
    return this.isLoaded;
  }
}
