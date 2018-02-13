class Vec3 {
  constructor(x = 0, y = 0, z = 0) {
    this.x = this.y = this.z = 0
    this.set(x, y, z)
  }

  normaliser() {
    const longueur = this.longueur()

    if (longueur != 0.0) {
      this.x /= longueur
      this.y /= longueur
      this.z /= longueur
    }
  }

  getX() {
    return this.x
  }
  getY() {
    return this.y
  }
  getZ() {
    return this.z
  }

  limiter(max) {
    const longueurCarre = this.x * this.x + this.y * this.y + this.z * this.z

    if (longueurCarre > max * max && longueurCarre > 0) {
      const ratio = max / Math.sqrt(longueurCarre)
      this.x *= ratio
      this.y *= ratio
      this.z *= ratio
    }
  }

  // cross
  produitVectoriel(v) {
    return new Vec3(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x,
    )
  }

  // dot
  produitScalaire(v) {
    return this.x * v.x + this.y * v.y + this.z * v.z
  }

  get() {
    return [this.x, this.y, this.z]
  }

  longueur() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
  }

  directionVers(v) {
    return new Vec3(v.x - this.x, v.y - this.y, v.z - this.z)
  }

  // ////////////////// OPERATOR ///////////////////////

  set(x, y, z) {
    if (x != null) {
      this.x = x
    }
    if (y != null) {
      this.y = y
    } else if (x != null) {
      this.y = x
    }
    if (z != null) {
      this.z = z
    } else if (x != null) {
      this.z = x
    }
  }

  egale(v) {
    this.x = v.x
    this.y = v.y
    this.z = v.z
  }

  plus(v) {
    this.x += v.x
    this.y += v.y
    this.z + v.z
    return this
  }

  plusValeur(valeur) {
    return new Vec3(this.x + valeur, this.y + valeur, this.z + valeur)
  }

  moins(v) {
    return new Vec3(this.x - v.x, this.y - v.y, this.z - v.z)
  }

  moinsValeur(valeur) {
    return new Vec3(this.x - valeur, this.y - valeur, this.z - valeur)
  }

  multiplierValeur(valeur) {
    this.x *= valeur
    this.y *= valeur
    this.z *= valeur
    return this
  }

  multiplierMatrice(matrice) {
    return new Vec3(
      matrice.d[0] * this.x + matrice.d[1] * this.y + matrice.d[2] * this.z,
      matrice.d[3] * this.x + matrice.d[4] * this.y + matrice.d[5] * this.z,
      matrice.d[6] * this.x + matrice.d[7] * this.y + matrice.d[8] * this.z,
    )
  }

  multiplier(v) {
    return new Vec3(this.x * v.x, this.y * v.y, this.z * v.z)
  }

  diviserValeur(valeur) {
    return new Vec3(this.x / valeur, this.y / valeur, this.z / valeur)
  }

  diviser(v) {
    return new Vec3(this.x / v.x, this.y / v.y, this.z / v.z)
  }

  distance(vec32) {
    return Math.sqrt(
      (vec32.x - this.x) * (vec32.x - this.x) +
        (vec32.y - this.y) * (vec32.y - this.y) +
        (vec32.z - this.z) * (vec32.z - this.z),
    )
  }

  angleDegree(v) {
    const dot = this.produitScalaire(v)
    const cosAngle = dot / (this.longueur() * v.longueur())
    const angleRadian = Math.acos(cosAngle)
    const angle = angleRadian * 180 / Math.PI
    const sens = signe(this.x * v.y + this.y * v.x) // sens de l'angle
    return angle * -sens
  }

  calculerNormale(v2, v3, sens) {
    const resultat = new Vec3()
    const U = new Vec3()
    const V = new Vec3()
    U.egale(v2.moins(this))
    V.egale(v3.moins(this))
    if (sens) {
      // inverser le produit vectoriel pour inverser la normale
      resultat.egale(V.produitVectoriel(U))
    } else {
      resultat.egale(U.produitVectoriel(V))
    }
    resultat.normaliser()
    return resultat
  }

  getBarycentre(v1, v2, v3, pos) {
    const det = (v2.z - v3.z) * (v1.x - v3.x) + (v3.x - v2.x) * (v1.z - v3.z)
    const l1 =
      ((v2.z - v3.z) * (pos[0] - v3.x) + (v3.x - v2.x) * (pos[1] - v3.z)) / det
    const l2 =
      ((v3.z - v1.z) * (pos[0] - v3.x) + (v1.x - v3.x) * (pos[1] - v3.z)) / det
    const l3 = 1.0 - l1 - l2
    return l1 * v1.y + l2 * v2.y + l3 * v3.y
  }
}

export default Vec3
