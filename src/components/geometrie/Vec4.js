class Vec4 {
  constructor(x = 0, y = 0, z = 0, w = 0) {
    this.x = this.y = this.z = 0;
    this.w = 0;
    this.set(x, y, z, w);
  }

  normaliser() {
    const longueur = this.longueur();

    if (longueur != 0.0) {
      this.x /= longueur;
      this.y /= longueur;
      this.z /= longueur;
      this.w /= longueur;
    }
  }

  get() {
    const valeurs = new Array(4);
    valeurs[0] = this.x;
    valeurs[1] = this.y;
    valeurs[2] = this.z;
    valeurs[3] = this.w;
    return valeurs;
  }

  longueur() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
  }

  // ////////////////// OPERATOR ///////////////////////

  set(x, y, z, w) {
    if (x != null) {
      this.x = x;
    }
    if (y != null) {
      this.y = y;
    } else if (x != null) {
      this.y = x;
    }
    if (z != null) {
      this.z = z;
    } else if (x != null) {
      this.z = x;
    }
    if (w != null) {
      this.w = w;
    } else if (x != null) {
      this.w = x;
    }
  }

  egale(v) {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    this.w = v.w;
  }

  plus(v) {
    const resultat = new Vec4();
    resultat.x = this.x + v.x;
    resultat.y = this.y + v.y;
    resultat.z = this.z + v.z;
    resultat.w = this.w + v.w;
    return resultat;
  }

  plusValeur(valeur) {
    const resultat = new Vec4();
    resultat.x = this.x + valeur;
    resultat.y = this.y + valeur;
    resultat.z = this.z + valeur;
    resultat.w = this.w + valeur;
    return resultat;
  }

  moins(v) {
    const resultat = new Vec4();
    resultat.x = this.x - v.x;
    resultat.y = this.y - v.y;
    resultat.z = this.z - v.z;
    resultat.w = this.w - v.w;
    return resultat;
  }

  moinsValeur(valeur) {
    const resultat = new Vec4();
    resultat.x = this.x - valeur;
    resultat.y = this.y - valeur;
    resultat.z = this.z - valeur;
    resultat.w = this.w - valeur;
    return resultat;
  }

  multiplierValeur(valeur) {
    const resultat = new Vec4();
    resultat.x = this.x * valeur;
    resultat.y = this.y * valeur;
    resultat.z = this.z * valeur;
    resultat.w = this.w * valeur;
    return resultat;
  }

  multiplierMatrice(matrice) {
    const resultat = new Vec4();
    resultat.x =
      matrice.d[0] * this.x + matrice.d[1] * this.y + matrice.d[2] * this.z + matrice.d[3] * this.w;
    resultat.y =
      matrice.d[4] * this.x + matrice.d[5] * this.y + matrice.d[6] * this.z + matrice.d[7] * this.w;
    resultat.z =
      matrice.d[8] * this.x +
      matrice.d[9] * this.y +
      matrice.d[10] * this.z +
      matrice.d[11] * this.w;
    resultat.w =
      matrice.d[12] * this.x +
      matrice.d[13] * this.y +
      matrice.d[14] * this.z +
      matrice.d[15] * this.w;
    return resultat;
  }

  multiplier(v) {
    const resultat = new Vec4();
    resultat.x = this.x * v.x;
    resultat.y = this.y * v.y;
    resultat.z = this.z * v.z;
    resultat.w = this.w * v.w;
    return resultat;
  }

  diviserValeur(valeur) {
    const resultat = new Vec4();
    resultat.x = this.x / valeur;
    resultat.y = this.y / valeur;
    resultat.z = this.z / valeur;
    resultat.w = this.w / valeur;
    return resultat;
  }

  diviser(v) {
    const resultat = new Vec4();
    resultat.x = this.x / v.x;
    resultat.y = this.y / v.y;
    resultat.z = this.z / v.z;
    resultat.w = this.w / v.w;
    return resultat;
  }

  distance(vec42) {
    return Math.sqrt(
      (vec42.x - this.x) * (vec42.x - this.x) +
        (vec42.y - this.y) * (vec42.y - this.y) +
        (vec42.z - this.z) * (vec42.z - this.z) +
        (vec42.w - this.w) * (vec42.w - this.w),
    );
  }
}

export default Vec4;
