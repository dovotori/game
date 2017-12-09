export default class Attractor {
  constructor() {
    this.position = new Vec3(0, 0, 0);
    this.vitesse = new Vec3(1, 1, 1);
    this.radius = 40.0; // rayon d'action
    this.strength = -10.0; // positive attraction, negative repulsion
    this.ramp = 0.2; // force elastique entre 0 et 0.9999
  }

  updatePong(width, height) {
    if (!width) {
      width = 600;
    }
    if (!height) {
      height = 600;
    }

    if (this.position.x < 0 || this.position.x > width) {
      this.vitesse.x *= -1;
    }
    if (this.position.y < 0 || this.position.y > height) {
      this.vitesse.y *= -1;
    }
    this.position.x += this.vitesse.x;
    this.position.y += this.vitesse.y;
  }

  draw() {
    context.fillRect(this.position.x - 5, this.position.y - 5, 10, 10);
  }

  attract(node) {
    var difference = this.position.moins(node.position);
    var distance = difference.longueur();

    if (distance > 0 && distance < this.radius) {
      var s = distance / this.radius;
      var force = 1 / Math.pow(s, 0.5 * this.ramp) - 1;
      force = this.strength * force / this.radius;

      difference = difference.multiplierValeur(force);
      node.vitesse = node.vitesse.plus(difference);
    }
  }

  setPosition(x, y, z) {
    if (!x) {
      x = 0;
    }
    if (!y) {
      y = 0;
    }
    if (!z) {
      z = 0;
    }
    this.position.set(x, y, z);
  }

  setRadius(value) {
    this.radius = value;
  } // rayon d'action
  setStrength(value) {
    this.strength = value;
  } // positive attraction, negative repulsion
  setRamp(value) {
    this.ramp = value;
  } // force elastique entre 0 et 0.9999

  getPosition() {
    return this.position;
  }
}
