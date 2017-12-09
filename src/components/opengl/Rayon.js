export default class Rayon {
  constructor() {
    this.objet = new Objet();
    this.model = new Mat4();

    this.origine = new Array(2);
    this.points = null;
    this.profondeur = 0.5;
  }

  setup() {
    this.model.identity();

    this.origine[0] = 0.0;
    this.origine[1] = 0.0;

    this.objet.setModeCalcul(gl.DYNAMIC_DRAW);
    this.objet.setupCustom(this.points);
    this.objet.setModeDessin(gl.TRIANGLES);
  }

  draw(camera, program) {
    if (program.isReady() && this.objet.isReady()) {
      this.model.push();
      this.model.scale(1, 1, 1);
      var normalmatrix = new Mat3();
      normalmatrix.set(this.model.getMatrice3x3());
      normalmatrix.inverser();

      program.setMatrices(
        camera.getProjection().transpose(),
        this.model.transpose(),
        camera.getView().transpose(),
        normalmatrix.get(),
      );
      var ambiant = new Vec3(1, 0.5, 1);
      program.setCouleurs(ambiant.get(), null, null);
      program.setOpacity(0.04);

      this.objet.draw(program.get());

      this.model.pop();
    }
  }

  update(tilemap) {
    var segments = tilemap.getSegments();
    if (segments != null) {
      var uniqueAngles = this.getUniqueAngles(segments);

      var intersects = [];
      for (var i = 0; i < uniqueAngles.length; i++) {
        // Calcule la direction du rayon
        var dx = Math.cos(uniqueAngles[i]);
        var dy = Math.sin(uniqueAngles[i]);

        // Appliquer la direction au rayon
        var ray = {
          a: { x: this.origine[0], y: this.origine[1] },
          b: { x: this.origine[0] + dx, y: this.origine[1] + dy },
        };

        var closestInter = this.closestIntersection(ray, segments);
        if (closestInter != null) {
          closestInter.angle = uniqueAngles[i]; // reattribuer l'angle // IMPORTANT
          intersects.push(closestInter);
        }
      }

      // Classer en fonction des angles // tres important
      intersects = intersects.sort(function (a, b) {
        return a.angle - b.angle;
      });

      this.points = new Array();
      this.points.length = 0;

      for (var i = 0; i < intersects.length; i++) {
        //delaunayPoints[i+1] = [intersects[i].x, intersects[i].y];
        this.points.push(this.origine[0], this.origine[1], this.profondeur);
        this.points.push(intersects[i].x, intersects[i].y, this.profondeur);
        if (intersects[i + 1] != null) {
          this.points.push(intersects[i + 1].x, intersects[i + 1].y, this.profondeur);
        } else {
          this.points.push(intersects[0].x, intersects[0].y, this.profondeur);
        }
      }

      // update forme
      this.objet.updateBuffer(this.points);
    }
  }

  getUniqueAngles(segments) {
    // On recupere les points sous la forme { x, y }
    var points = (function (s) {
      var a = [];
      s.forEach(function (seg) {
        a.push(seg.a, seg.b);
      });
      return a;
    })(segments);

    // garde points uniques
    var uniquePoints = (function (points) {
      var set = {};
      return points.filter(function (p) {
        var key = p.x + ',' + p.y;
        if (key in set) {
          return false;
        } else {
          set[key] = true;
          return true;
        }
      });
    })(points);

    // recuperes angles correspondants
    var uniqueAngles = [];
    for (var j = 0; j < uniquePoints.length; j++) {
      var uniquePoint = uniquePoints[j];
      var angle = Math.atan2(uniquePoint.y - this.origine[1], uniquePoint.x - this.origine[0]);
      uniquePoint.angle = angle;
      uniqueAngles.push(angle - 0.00001, angle, angle + 0.00001); // 2 rayon en plus pour taper le mur derriere
    }
    return uniqueAngles;
  }

  closestIntersection(ray, segments) {
    var closestIntersect = null;
    for (var i = 0; i < segments.length; i++) {
      // dessin des segments
      //points.push(segments[i].a.x); points.push(segments[i].a.y); points.push(0.1);
      //points.push(segments[i].b.x); points.push(segments[i].b.y); points.push(0.1);

      // trouver l'intersection la plus proche
      var intersect = this.getIntersection(ray, segments[i]);
      if (!intersect) continue;
      if (!closestIntersect || intersect.param < closestIntersect.param) {
        closestIntersect = intersect;
      }
    }
    var intersection = closestIntersect;

    // dessin du rayon
    if (intersection != null) {
      return intersection;
      //this.points.push(ray.a.x); this.points.push(ray.a.y); this.points.push(0.1);
      //this.points.push(intersection.x); this.points.push(intersection.y); this.points.push(0.1);
      //this.pointsDelaunay.push([intersection.x, intersection.y]);
    } else {
      return null;
    }
  }

  getIntersection(ray, segment) {
    // RAY in parametric: Point + Direction*T1
    var r_px = ray.a.x;
    var r_py = ray.a.y;
    var r_dx = ray.b.x - ray.a.x;
    var r_dy = ray.b.y - ray.a.y;

    // SEGMENT in parametric: Point + Direction*T2
    var s_px = segment.a.x;
    var s_py = segment.a.y;
    var s_dx = segment.b.x - segment.a.x;
    var s_dy = segment.b.y - segment.a.y;

    // Si parallele, pas d'intersection
    var r_mag = Math.sqrt(r_dx * r_dx + r_dy * r_dy);
    var s_mag = Math.sqrt(s_dx * s_dx + s_dy * s_dy);
    if (r_dx / r_mag == s_dx / s_mag && r_dy / r_mag == s_dy / s_mag) {
      // Meme direction
      return null;
    }

    // SOLVE FOR T1 & T2
    var T2 = (r_dx * (s_py - r_py) + r_dy * (r_px - s_px)) / (s_dx * r_dy - s_dy * r_dx);
    var T1 = (s_px + s_dx * T2 - r_px) / r_dx;

    // Must be within parametic whatevers for RAY/SEGMENT
    if (T1 < 0) return null;
    if (T2 < 0 || T2 > 1) return null;

    // retourne l'intersection
    return {
      x: r_px + r_dx * T1,
      y: r_py + r_dy * T1,
      param: T1,
    };
  }

  setPosition(x, y) {
    this.origine[0] = x;
    this.origine[1] = y;
  }
}
