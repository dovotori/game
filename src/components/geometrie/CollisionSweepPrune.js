import CollisionEndpoint from "./CollisionEndpoint"
import CollisionPairManager from "./CollisionPairManager"

export default class {
  constructor() {
    this.listeAxe = Array(3) // liste de Endpoint sur l'axe des X
    this.listeAxe[0] = Array()
    this.listeAxe[1] = Array()
    this.listeAxe[2] = Array()
    this.pm = new CollisionPairManager()

    this.cptEndpointPlace = 0
    this.endpointAplacer
    this.activeList = Array()
  }

  setup(boxs) {
    this.addBoxes(boxs)
    //for(var i = 0; i < liste.length; i++){ console.log(liste[i].get()); }
    //for(var i = 0; i < this.listeAxe[0].length; i++){ console.log(this.listeAxe[0][i].get()); }
  }

  addBoxes(boxs) {
    // on crée une liste decroisante des endpoints des nouvelles boites
    var endpointsDecroissantsX = Array()
    var endpointsDecroissantsY = Array()
    for (var i = 0; i < boxs.length; i++) {
      endpointsDecroissantsX = this.addEndpointDecroissant(
        endpointsDecroissantsX,
        boxs[i].getMin(0),
        boxs[i].getMax(0),
      )
      endpointsDecroissantsY = this.addEndpointDecroissant(
        endpointsDecroissantsY,
        boxs[i].getMin(1),
        boxs[i].getMax(1),
      )
    }

    // on ajoute les addpoints aux listes
    var axe = 0
    this.addEndPointsOnListe(axe, endpointsDecroissantsX)
    axe++
    this.addEndPointsOnListe(axe, endpointsDecroissantsY)
  }

  addEndpointDecroissant(liste, newMin, newMax) {
    var e = new CollisionEndpoint()
    e.set(-9999)
    liste.push(e)
    liste.push(e)

    var endpointAplacer = newMin
    var cptEndpointPlace = 0

    for (var i = liste.length - 1; i >= 0; i--) {
      var oldListe = liste[i - (2 - cptEndpointPlace)]
      if (oldListe) {
        if (oldListe.get() > endpointAplacer.get()) {
          liste[i] = endpointAplacer
          cptEndpointPlace++
          endpointAplacer = newMax
        } else {
          liste[i] = oldListe
        }
      } else {
        // deux derniers
        liste[i] = endpointAplacer
        cptEndpointPlace++
        endpointAplacer = newMax
      }

      // on arete la boucle si plus de points a placer
      if (cptEndpointPlace == 2) {
        break
      }
    }

    return liste
  }

  addEndPointsOnListe(
    axe,
    newEndPoints, // array des new points en sens decroissant
  ) {
    var e = new CollisionEndpoint()
    e.set(9999)
    for (var i = 0; i < newEndPoints.length; i++) {
      this.listeAxe[axe].push(e)
    }

    // TRI
    this.cptEndpointPlace = 0
    this.endpointAplacer = newEndPoints[this.cptEndpointPlace]

    // COLLISION
    this.activeList = Array()

    for (var i = this.listeAxe[axe].length - 1; i >= 0; i--) {
      this.loopTri(axe, newEndPoints, i)
      this.loopCheckCollision(axe, i)
    }
  }

  loopTri(axe, newEndPoints, i) {
    if (this.cptEndpointPlace < newEndPoints.length) {
      var oldListe = this.listeAxe[axe][
        i - (newEndPoints.length - this.cptEndpointPlace)
      ]
      if (oldListe) {
        if (this.endpointAplacer.get() > oldListe.get()) {
          this.listeAxe[axe][i] = this.endpointAplacer
          this.cptEndpointPlace++
          this.endpointAplacer = newEndPoints[this.cptEndpointPlace]
        } else {
          this.listeAxe[axe][i] = oldListe
        }
      } else {
        // deux derniers
        this.listeAxe[axe][i] = this.endpointAplacer
        this.cptEndpointPlace++
        this.endpointAplacer = newEndPoints[this.cptEndpointPlace]
      }
    }
    //if(this.cptEndpointPlace == newEndPoints.length){ break; } // on arete la boucle si plus de points a placer
  }

  loopCheckCollision(axe, i) {
    var id = this.listeAxe[axe][i].getID()
    if (!this.listeAxe[axe][i].isMinimum()) {
      // c'est un max
      for (var j = 0; j < this.activeList.length; j++) {
        this.pm.addPaire([this.activeList[j], id], axe) // on reporte la paire comme potentiel collision
      }
      this.activeList.push(id) // on ajoute dans l'active liste
    } else {
      // c'est un min
      for (var j = 0; j < this.activeList.length; j++) {
        if (this.activeList[j] == id) {
          this.activeList.splice(j, 1)
          break // on retire de l'active liste
        }
      }
    }
  }

  update(boxs) {
    //this.checkCollision(boxs);
    var paires = this.pm.getPaires(true, true, false)
    for (var i = 0; i < paires.length; i++) {
      console.log(paires[i])
    }
  }

  removeBox(box) {
    this.pm.removeFromId(box.getID())
  }
}
