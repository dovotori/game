export default class Sculpture {
  constructor() {
    this.points;
    this.pointsReference;
    this.proportionnelleDistance;

    this.nodes;
    this.attractor;
    this.springs;

    this.input;
  }

  setup() {
    this.proportionnelleDistance = 20;

    this.setupPoints();
    this.setupNodes();

    this.input = new Input();
    this.input.setup();
  }

  setupPoints() {
    this.points = [];
    this.pointsReference = [];

    var cpt = 0;
    for (var y = 0; y < 10; y++) {
      for (var x = 0; x < 10; x++) {
        this.points[cpt] = x * this.proportionnelleDistance;
        this.points[cpt + 1] = y * this.proportionnelleDistance;
        this.pointsReference[cpt] = this.points[cpt];
        this.pointsReference[cpt + 1] = this.points[cpt + 1];
        cpt += 2;
      }
    }
  }

  setupPointsFromSvg() {
    var objet = document.getElementsByTagName('embed')[0];
    var svgDom = getSubDocument(objet);

    if (svgDom != null) {
      var svg = svgDom.getElementsByTagName('svg')[0];

      var parseSvg = new ParsingSvg();
      parseSvg.setup(svg);

      this.points = parseSvg.getPoints();
      this.pointsReference = [];
    }
  }

  setupNodes() {
    this.nodes = [];
    this.attractor = new Attractor();
    this.spring = new Spring();

    this.attractor.setPosition(0, 0, 0);

    var cptNodes = 0;
    for (var i = 0; i < this.points.length; i += 2, cptNodes++) {
      this.nodes[cptNodes] = new Node();
      this.nodes[cptNodes].setPosition(this.pointsReference[i], this.pointsReference[i + 1], 0);
    }
  }

  draw() {
    context.fillStyle = '#fff';

    this.attractor.setPosition(this.input.getSourisX(), this.input.getSourisY());
    this.attractor.draw();

    this.updatePoints();
    this.drawPoints();
  }

  drawPoints() {
    var cptNodes = 0;
    var taillePoint = 2;

    for (var i = 0; i < this.points.length; i += 2, cptNodes++) {
      var origine = new Vec3(this.pointsReference[i], this.pointsReference[i + 1], 0);

      // RESTRICTION SPRING
      this.spring.update(origine, this.nodes[cptNodes]);

      // DESSIN POINT REFERENCE ET POINT
      context.fillRect(this.pointsReference[i], this.pointsReference[i + 1], 1, 1);
      context.fillRect(
        this.nodes[cptNodes].position.x - taillePoint / 2,
        this.nodes[cptNodes].position.y - taillePoint / 2,
        taillePoint,
        taillePoint,
      );

      // DESSIN LIGNE ENTRE ORIGINE ET LE POINT
      context.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      context.beginPath();
      context.moveTo(origine.x, origine.y);
      context.lineTo(this.nodes[cptNodes].position.x, this.nodes[cptNodes].position.y);
      context.stroke();
    }
  }

  updatePoints() {
    for (var i = 0; i < this.nodes.length; i++) {
      this.attractor.attract(this.nodes[i]);
      this.nodes[i].updateLinear(false, false, true);

      this.drawLiaisonProche(i);
    }
  }

  drawLiaisonProche(i) {
    var limiteDistance = this.proportionnelleDistance;

    for (var j = 0; j < this.nodes.length; j++) {
      var distance = this.nodes[i].position.distance(this.nodes[j].position);

      if (distance > 1 && distance < limiteDistance) {
        var opacite = 0;
        if (distance > limiteDistance / 2) {
          opacite = map(distance, limiteDistance / 2, limiteDistance, 1, 0.2);
        } else {
          opacite = map(distance, 0, limiteDistance / 2, 0.2, 1);
        }

        context.strokeStyle = 'rgba(255, 255, 255, ' + opacite + ')';
        context.beginPath();
        context.moveTo(this.nodes[i].position.x, this.nodes[i].position.y);
        context.lineTo(this.nodes[j].position.x, this.nodes[j].position.y);
        context.stroke();
      }
    }

    context.strokeStyle = '#fff';
  }
}
