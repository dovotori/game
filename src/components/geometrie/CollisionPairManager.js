export default class {
  constructor() {
    this.listesAxe = Array(3) // contient les paires qui overlap sur chacun des axes
    this.resetPairesAxes()
  }

  resetPairesAxes() {
    for (var i = 0; i < this.listesAxe.length; i++) {
      this.listesAxe[i] = Array()
    }
  }

  addPaireOnAxe(paire, axe) {
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

  getPaires(axeX, axeY, axeZ) {
    let paires
    if (axeX) {
      paires = this.listesAxe[0]
      if (axeY) {
        paires = this.compareListes(paires, this.listesAxe[1])
        if (axeZ) {
          paires = this.compareListes(paires, this.listesAxe[2])
        }
      }
      return paires
    } else {
      return null
    }
  }
}
