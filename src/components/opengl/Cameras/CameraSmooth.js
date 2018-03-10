import Target from "../../geometry/Target"
import Camera from "./Camera"

export default class extends Camera {
  constructor(options) {
    super(options)
    this.options = options
    this.rotationX = new Target()
    this.targetX = new Target()
    this.zoomZ = new Target(1, 0.01)
  }

  update() {
    this.rotationX.update()
    this.zoomZ.update()
    this.targetX.update()
    this.position.set(
      this.options.position.x +
        this.targetX.get() +
        Math.sin(this.rotationX.get()) *
          (this.options.position.z * this.zoomZ.get()),
      this.options.position.y,
      Math.cos(this.rotationX.get()) *
        (this.options.position.z * this.zoomZ.get()),
    )
    this.target.set(
      this.options.target.x + this.targetX.get(),
      this.options.target.y,
      this.options.target.z,
    )
    this.lookAt()
  }

  setSmoothTarget(value) {
    this.targetX.set(value)
  }

  setSmoothRotation(value) {
    this.rotationX.set(value)
  }

  setSmoothZoom(value) {
    this.zoomZ.set(value)
  }
}
