import Context from "./Context"

export default class Canvas {
  constructor() {
    this.canvas = document.createElement("canvas")
    this.context = new Context(this.canvas)

    this.resize = this.resize.bind(this)

    this.canvas.style.width = "100%"
    window.addEventListener("resize", this.resize, false)
    this.resize()
  }

  resize() {
    this.canvas.style.height = `${window.innerHeight}px`
  }

  get() {
    return this.canvas
  }
}
