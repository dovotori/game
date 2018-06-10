import Scene from "./SceneGame"
import Target from "../../geometry/Target"
import PostProcess from "../PostProcess"

export default class extends Scene {
  constructor(gl, config, assets) {
    super(gl, config, assets)
    this.postProcess = new PostProcess(this.gl, 1024, 1024)
    this.targetRGB = new Target(0, 0.1)
    this.targetWave = new Target(Math.PI / 2, 0.1)
  }

  resize(box) {
    super.resize(box)
    this.postProcess.resize(box)
  }

  renderBeforeProcess() {}

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
    const center = this.camera.get2dScreenPoint(
      this.heros.getPositionVec3(),
      this.screenSize,
    )
    this.postProcess.setFXAA()
    this.postProcess.setRGB(this.targetRGB.get(), 0)
    // this.postProcess.setWave(this.targetWave.get(), 0.1, center)
  }

  render() {
    this.time++
    this.update()
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
    this.renderBeforeProcess()
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
    this.postProcess.start()
    super.renderMain()
    this.postProcess.end()
    this.effectsList()
    this.postProcess.render()
  }
}
