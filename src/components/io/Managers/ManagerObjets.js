import Objet from "../../opengl/ObjetObj"

export default class {
  constructor(gl, objets) {
    this.objets = {}
    for (let name in objets) {
      this.objets[name] = new Objet(gl, objets[name])
    }
  }

  get(id) {
    return this.objets[id]
  }
}
