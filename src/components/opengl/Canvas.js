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
    const w = document.body.offsetWidth
    const h = window.innerHeight
    this.canvas.style.width = `${w}px`
    this.canvas.style.height = `${h}px`
    this.canvas.setAttribute("width", w)
    this.canvas.setAttribute("height", h)
    this.context.onResize({
      width: w,
      height: h,
    })
  }

  get() {
    return this.canvas
  }
}
