import { mapFromRange } from "../utils/numbers"

export default class Mouse {
  constructor(div, callbackDrag, callbackDown, callbackMove) {
    this.div = div
    this.callbackDrag = callbackDrag
    this.callbackDown = callbackDown
    this.callbackMove = callbackMove
    this.isDragging = false
    this.startDraggingMousePos = { x: 0, y: 0 }
    this.oldMousePos = { x: 0, y: 0 }

    this.onMouseMove = this.onMouseMove.bind(this)
    this.onMouseDown = this.onMouseDown.bind(this)
    this.onMouseUp = this.onMouseUp.bind(this)

    this.setup()
  }

  setup() {
    this.div.addEventListener("mousemove", this.onMouseMove, false)
    this.div.addEventListener("mousedown", this.onMouseDown, false)
    window.addEventListener("mouseup", this.onMouseUp, false)
  }

  computeInfos(e) {
    const box = this.div.getBoundingClientRect()
    const x = e.clientX - box.x
    const y = e.clientY - box.y
    return {
      size: box,
      pos: { x, y },
      rel: {
        x: mapFromRange(x, 0, box.width, -1, 1),
        y: mapFromRange(y, 0, box.height, 1, -1),
      },
      relDown: {
        x: this.startDraggingMousePos.x - e.clientX,
        y: this.startDraggingMousePos.y - e.clientY,
      },
      relPrevious: {
        x: this.oldMousePos.x - e.clientX,
        y: this.oldMousePos.y - e.clientY,
      },
    }
  }

  onMouseMove(e) {
    const infos = this.computeInfos(e)
    this.callbackMove(infos)
    if (this.isDragging) {
      this.callbackDrag(infos)
      this.oldMousePos = { x: e.clientX, y: e.clientY }
    }
  }

  onMouseDown(e) {
    this.isDragging = true
    this.startDraggingMousePos = { x: e.clientX, y: e.clientY }
    this.oldMousePos = { x: e.clientX, y: e.clientY }
    this.callbackDown(this.computeInfos(e))
  }

  onMouseUp() {
    this.isDragging = false
  }

  get() {
    return this.infos
  }
}
