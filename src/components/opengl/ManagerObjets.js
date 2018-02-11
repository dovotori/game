import Objet from "./ObjetObj"

export default class {
  constructor(gl, objets) {
    this.objets = objets.map(objet => new Objet(gl, objet))
  }

  get(id) {
    return this.objets[id]
  }
}
