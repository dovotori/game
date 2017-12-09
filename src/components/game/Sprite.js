export default class Sprite extends Mesh {
  constructor() {
    super();

    this.timer = new Timer();
    this.grille = new Array(2);
    this.uv = new Array(2);
    this.uvDepart = new Array(2);
    this.uvLimite = new Array(2);
    this.vitesse = 2000; // en ms
    this.mode = 0; // 0 static / 1 colonne / 2 rangee
    this.sens = 1.0; // 1.0 vers droite, -1.0 vers gauche
    this.endAnim = true;
    this.askAnim = false;
  }

  setup() {
    Mesh.prototype.setup.call(this);

    this.grille[0] = 1;
    this.grille[1] = 1;

    this.uv[0] = 0;
    this.uv[1] = 0;

    this.uvLimite[0] = 1;
    this.uvLimite[1] = 1;
    this.uvDepart[0] = 0;
    this.uvDepart[1] = 0;
  }

  draw(camera, program, objet) {
    if (program.isReady()) {
      this.animation();
      program.setSprite(this.grille, this.uv);
      Mesh.prototype.draw.call(this, camera, program, objet);
    }
  }

  drawFlat(camera, program, objet) {
    if (program.isReady()) {
      this.animation();
      program.setSprite(this.grille, this.uv);
      Mesh.prototype.drawFlat.call(this, camera, program, objet);
    }
  }

  animation() {
    if (this.mode > 0) {
      this.timer.update();
      if (this.timer.getStop()) {
        this.timer.start(this.vitesse);

        // COLONNES
        if (this.mode == 1) {
          if (this.uv[0] < this.uvLimite[0] - 1) {
            this.uv[0]++;
          } else {
            if (this.askAnim) {
              this.finAnim();
            } else {
              this.uv[0] = this.uvDepart[0];
            }
          }

          // RANGEES
        } else if (this.mode == 2) {
          if (this.uv[1] < this.uvLimite[1] - 1) {
            this.uv[1]++;
          } else {
            this.uv[1] = this.uvDepart[1];
          }
        }
      }
    }
  }

  finAnim() {
    this.endAnim = true;
    this.askAnim = false;
  }

  setMode(valeur) {
    this.mode = valeur;
  }
  setUV(x, y) {
    this.uv[0] = x;
    this.uv[1] = y;
  }
  setV(y) {
    this.uv[1] = y;
  }
  setU(x) {
    this.uv[0] = x;
  }
  setInterval(time) {
    this.vitesse = time;
  }
  setGrille(grilleX, grilleY) {
    this.grille[0] = grilleX;
    this.grille[1] = grilleY;
  }
  setSpeed(valeur) {
    this.vitesse = valeur;
  }
  setTexture(chemin) {
    this.cheminTexture = chemin;
  }
  setSens(valeur) {
    this.sens = valeur;
  }
  setUVLimite(x, y) {
    this.uvLimite[0] = x;
    this.uvLimite[1] = y;
  }
  setUVDepart(x, y) {
    this.uvDepart[0] = x;
    this.uvDepart[1] = y;
  }
  setVLimite(y) {
    this.uvLimite[1] = y;
  }
  setULimite(x) {
    this.uvLimite[0] = x;
  }
  setVDepart(y) {
    this.uvDepart[1] = y;
  }
  setUDepart(x) {
    this.uvDepart[0] = x;
  }
  setTailleSprite(x, y) {
    this.setGrille(this.texture.getWidth() / x, this.texture.getHeight() / y);
  }
  setAnim() {
    this.endAnim = false;
    this.askAnim = true;
    this.timer.start(this.vitesse);
  }

  getEndAnim() {
    return this.endAnim;
  }
  getU() {
    return this.uv[0];
  }
  getMode() {
    return this.mode;
  }
  getULimite() {
    return this.uvLimite[0];
  }
  getGrille() {
    return this.grille;
  }
}
