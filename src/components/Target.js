export default class {
  constructor(value = 0, options = {}) {
    this.value = value
    this.target = value
    this.sampling = options.sampling || 0.04
  }

  update() {
    this.value += (this.target - this.value) * this.sampling
  }

  get() {
    return this.value
  }

  set(value) {
    this.target = value
  }
}
