export default class {
  constructor() {
    this.position = new Vec3(0, 0, 0)
    this.vitesse = new Vec3(0, 0, 0)
  }

  // Node.taille = 2;
  // Node.damping = 0.01; // amortissement, ralentissement entre 0 et 0.99999
  // Node.minX = 0;
  // Node.minY = 0;
  // Node.minZ = 0;
  // Node.maxX = 500;
  // Node.maxY = 500;
  // Node.maxZ = 500;

  setup(x, y, z) {
    if (x != null) {
      this.position.x = x
    }
    if (y != null) {
      this.position.y = y
    }
    if (z != null) {
      this.position.z = z
    }
  }

  updateLinear(lockX, lockY, lockZ) {
    // ACCELARATION AVEC VITESSE ET RALENTISSEMENT PROGRESSIF
    if (!lockX) {
      this.position.x += this.vitesse.x
    }
    if (!lockY) {
      this.position.y += this.vitesse.y
    }
    if (!lockZ) {
      this.position.z += this.vitesse.z
    }

    if (this.position.x < Node.minX) {
      this.position.x = Node.minX - (this.position.x - Node.minX)
      this.vitesse.x *= -1
    }

    if (this.position.x > Node.maxX) {
      this.position.x = Node.maxX - (this.position.x - Node.maxX)
      this.vitesse.x *= -1
    }

    if (this.position.y < Node.minY) {
      this.position.y = Node.minY - (this.position.y - Node.minY)
      this.vitesse.y *= -1
    }

    if (this.position.y > Node.maxY) {
      this.position.y = Node.maxY - (this.position.y - Node.maxY)
      this.vitesse.y *= -1
    }

    if (this.position.z < Node.minZ) {
      this.position.z = Node.minZ - (this.position.z - Node.minZ)
      this.vitesse.z *= -1
    }

    if (this.position.z > Node.maxZ) {
      this.position.z = Node.maxZ - (this.position.z - Node.maxZ)
      this.vitesse.z *= -1
    }

    // ralentissement du node
    this.vitesse = this.vitesse.multiplierValeur(Node.damping)
  }

  update() {
    this.position.x += this.vitesse.x
    this.position.y += this.vitesse.y
    this.position.z += this.vitesse.z
  }

  rebond() {
    if (this.position.x < Node.minX) {
      this.vitesse.x *= -1
    }
    if (this.position.x > Node.maxX) {
      this.vitesse.x *= -1
    }
    if (this.position.y < Node.minY) {
      this.vitesse.y *= -1
    }
    if (this.position.y > Node.maxY) {
      this.vitesse.y *= -1
    }
    if (this.position.z < Node.minZ) {
      this.vitesse.z *= -1
    }
    if (this.position.z > Node.maxZ) {
      this.vitesse.z *= -1
    }
  }

  respawnBordures() {
    if (this.position.x < -Node.taille) {
      this.position.x = Node.maxX + Node.taille
    }
    if (this.position.y < -Node.taille) {
      this.position.y = Node.maxY + Node.taille
    }
    if (this.position.z < -Node.taille) {
      this.position.z = Node.maxZ + Node.taille
    }

    if (this.position.x > Node.maxX + Node.taille) {
      this.position.x = -Node.taille
    }
    if (this.position.y > Node.maxY + Node.taille) {
      this.position.y = -Node.taille
    }
    if (this.position.z > Node.maxZ + Node.taille) {
      this.position.z = -Node.taille
    }
  }

  draw() {
    context.fillStyle = "#f00"
    context.fillRect(this.position.x, this.position.y, Node.taille, Node.taille)
  }

  // Node.setBox(minX, minY, minZ, maxX, maxY, maxZ) {
  //     Node.minX = minX;
  //     Node.minY = minY;
  //     Node.minZ = minZ;
  //     Node.maxX = maxX;
  //     Node.maxY = maxY;
  //     Node.maxZ = maxZ;
  // }

  setPosition(x, y, z) {
    this.position.set(x, y, z)
  }
  setVitesse(x, y, z) {
    this.vitesse.set(x, y, z)
  }

  getPosition() {
    return this.position
  }
  getVitesse() {
    return this.vitesse
  }
}
