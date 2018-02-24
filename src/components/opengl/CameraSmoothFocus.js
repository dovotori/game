import Target from "../Target"
import Camera from "./Camera"

export default class extends Camera {
  constructor(options) {
    super(options)
    this.options = options
    this.rotationX = new Target()
    this.zoomZ = new Target(1, 0.01)
  }

  update() {
    this.rotationX.update()
    this.zoomZ.update()
    this.position.set(
      this.options.position.x +
        Math.sin(this.rotationX.get()) *
          (this.options.position.z * this.zoomZ.get()),
      this.options.position.y,
      Math.cos(this.rotationX.get()) *
        (this.options.position.z * this.zoomZ.get()),
    )
    this.lookAt()
  }

  setRotation(value) {
    this.rotationX.set(value)
  }

  setZoom(value) {
    this.zoomZ.set(value)
  }
}
