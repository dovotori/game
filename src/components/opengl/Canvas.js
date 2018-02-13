import Context from "./Context"

export default class {
  constructor() {
    this.canvas = document.createElement("canvas")
    this.resize = this.resize.bind(this)
    this.canvas.style.width = "100%"
    this.context = new Context(this.canvas)
  }

  resize(box) {
    this.canvas.style.width = `${box.width}px`
    this.canvas.style.height = `${box.height}px`
    this.canvas.setAttribute("width", box.width)
    this.canvas.setAttribute("height", box.height)
  }

  get() {
    return this.canvas
  }

  getContext() {
    return this.context.get()
  }
}
