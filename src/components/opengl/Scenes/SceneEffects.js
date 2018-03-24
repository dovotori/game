import Scene from "./SceneCollision"
import Target from "../../geometry/Target"

export default class extends Scene {
  constructor(gl, scene, callbackLoaded = null) {
    super(gl, scene, callbackLoaded)
    this.targetRGB = new Target(0, 0.1)
    this.targetWave = new Target(Math.PI / 2, 0.1)
  }

  afterStart() {
    super.afterStart()
    this.targetRGB.update()
    this.targetWave.update()
    if (this.heros.getInverseX()) {
      this.camera.setSmoothRotation(0.1)
      this.camera.setSmoothTarget(-4)
    } else {
      this.camera.setSmoothRotation(-0.1)
      this.camera.setSmoothTarget(4)
    }
    if (this.heros.getAiming()) {
      this.targetWave.set(Math.PI)
      this.camera.setSmoothZoom(0.9)
    } else {
      this.targetWave.set(Math.PI * 2 + Math.PI / 2)
      this.camera.setSmoothZoom(1)
    }
    if (this.heros.getDashing()) {
      this.targetRGB.set(1)
    } else {
      this.targetRGB.set(0)
    }
  }

  effectsList() {
    const center2 = this.camera.get2dPoint(this.heros.getPosition())
    const center = [0.5, 0.5]
    this.postProcess.setFXAA()
    this.postProcess.setRGB(this.targetRGB.get(), 0)
    this.postProcess.setWave(this.targetWave.get(), 0.1, center)
    const debug = document.getElementById("debug")
    debug.style.left = `${center2[0] * this.screenSize.width}px`
    debug.style.top = `${center2[1] * this.screenSize.height}px`
  }
}
