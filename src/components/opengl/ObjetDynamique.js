export default class ObjetDynamique extends Objet {
  constructor() {
    super();
  }

  apply(data) {
    var obj = new LoadObj(data);
    this.points[0] = obj.getVertices();
    this.points[1] = obj.getVerticesDecale1();
    this.points[2] = obj.getVerticesDecale2();
    this.nbPoints = obj.getNbFaces() * 3;

    this.vbo[0] = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo[0]);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.points[0]), this.modeCalcul);

    this.vbo[1] = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo[1]);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.points[1]), this.modeCalcul);

    this.vbo[2] = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo[2]);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.points[2]), this.modeCalcul);

    this.isLoaded = true;
  }

  draw(program) {
    if (program.vLoc > -1) {
      gl.enableVertexAttribArray(program.vLoc);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo[0]);
      gl.vertexAttribPointer(program.vLoc, 3, gl.FLOAT, false, 0, 0);
    }

    if (program.vdLoc > -1) {
      gl.enableVertexAttribArray(program.vdLoc);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo[1]);
      gl.vertexAttribPointer(program.vdLoc, 3, gl.FLOAT, false, 0, 0);
    }

    if (program.vddLoc > -1) {
      gl.enableVertexAttribArray(program.vddLoc);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo[2]);
      gl.vertexAttribPointer(program.vddLoc, 3, gl.FLOAT, false, 0, 0);
    }

    gl.drawArrays(this.modeDessin, 0, this.nbPoints);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }
}
