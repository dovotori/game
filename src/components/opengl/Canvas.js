import Context from "./Context"
import Mouse from "../Mouse"

export default class {
  constructor(options) {
    this.canvas = document.createElement("canvas")
    this.context = new Context(this.canvas)

    this.resize = this.resize.bind(this)
    this.setDraggingInfos = this.setDraggingInfos.bind(this)
    this.onMouseDown = this.onMouseDown.bind(this)
    this.onMouseMove = this.onMouseMove.bind(this)

    this.canvas.style.width = "100%"
    window.addEventListener("resize", this.resize, false)
    this.resize()

    if (options.mouse) {
      this.mouse = new Mouse(
        this.canvas,
        this.setDraggingInfos,
        this.onMouseDown,
        this.onMouseMove,
      )
    }
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

  onMouseMove(infos) {
    this.context.onMouseMove(infos)
  }

  onMouseDown(infos) {
    this.context.onMouseDown(infos)
  }

  setDraggingInfos(infos) {
    this.context.setDraggingInfos(infos)
  }

  get() {
    return this.canvas
  }
}
