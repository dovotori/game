export default class {
  constructor() {
    this.value
    this.isMin
    this.ownerId
  }

  setup(isMin, id) {
    this.isMin = isMin
    this.ownerId = id // box owner id
  }

  update() {}

  set(v) {
    this.value = v
  }

  get() {
    return this.value
  }

  getID() {
    return this.ownerId
  }

  isMinimum() {
    return this.isMin
  }
}
