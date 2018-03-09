export default class {
  constructor() {
    this.paires = Array()
    this.listesAxe = Array(3)
    for (var i = 0; i < this.listesAxe.length; i++) {
      this.listesAxe[i] = Array()
    }
  }

  addPaire(paire, axe) {
    var already = false
    for (var i = 0; i < this.listesAxe[axe].length; i++) {
      if (
        (paire[0] == this.listesAxe[axe][i][0] &&
          paire[1] == this.listesAxe[axe][i][1]) ||
        (paire[1] == this.listesAxe[axe][i][0] &&
          paire[0] == this.listesAxe[axe][i][1])
      ) {
        already = true
        break
      }
    }
    if (!already) {
      this.listesAxe[axe].push(paire)
    }
  }

  removePaire(paire) {
    for (var i = 0; i < this.paires.length; i++) {
      if (
        (paire[0] == this.paires[i][0] && paire[1] == this.paires[i][1]) ||
        (paire[1] == this.paires[i][0] && paire[0] == this.paires[i][1])
      ) {
        this.paires.splice(i, 1)
        break
      }
    }
  }

  removeFromId(id) {
    for (var i = 0; i < this.paires.length; i++) {
      if (this.paires[i][0] == id || this.paires[i][1] == id) {
        this.paires.splice(i, 1)
        break
      }
    }
  }

  getPaires(axeX, axeY, axeZ) {
    if (axeX) {
      this.paires = this.listesAxe[0]
      if (axeY) {
        this.paires = this.compareListes(this.paires, this.listesAxe[1])
        if (axeZ) {
          this.paires = this.compareListes(this.paires, this.listesAxe[2])
        }
      }
      return this.paires
    } else {
      return null
    }
  }

  compareListes(liste1, liste2) {
    var tmp = Array()
    for (var i = 0; i < liste1.length; i++) {
      for (var j = 0; j < liste2.length; j++) {
        if (
          (liste1[i][0] == liste2[j][0] && liste1[i][1] == liste2[j][1]) ||
          (liste1[i][1] == liste2[j][0] && liste1[i][0] == liste2[j][1])
        ) {
          tmp.push([liste1[i][0], liste1[i][1]])
        }
      }
    }
    return tmp
  }
}
