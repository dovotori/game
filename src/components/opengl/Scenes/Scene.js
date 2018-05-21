import Camera from "../Cameras/CameraSmooth"
import Lampe from "../Lampe"
import PostProcess from "../PostProcess"
import ManagerTextures from "../../io/Managers/ManagerTextures"
import ManagerObjets from "../../io/Managers/ManagerObjets"
import ManagerPrograms from "../../io/Managers/ManagerPrograms"

export default class {
  constructor(gl, scene, assets) {
    this.gl = gl
    this.camera = new Camera(scene.camera)
    this.postProcess = new PostProcess(this.gl, 1024, 1024)
    this.screenSize = null
    this.mousePos = null
    this.lampe = new Lampe(this.gl, scene.lampe)
    this.time = 0
    this.mngProg = new ManagerPrograms(this.gl, scene.programs)
    this.one = false
    this.start = false

    this.mngTex = new ManagerTextures(this.gl, assets.textures)
    this.mngObj = new ManagerObjets(this.gl, assets.objets)
  }

  resize(box) {
    this.camera.perspective(box.width, box.height)
    this.screenSize = box
    this.postProcess.resize(box)
    this.gl.viewport(0, 0, this.screenSize.width, this.screenSize.height)
  }

  render() {
    this.time++
    this.update()

    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
    this.renderBeforeProcess()

    // if (this.mousePos !== null) {
    //   const pixel = this.getColorPixel(this.mousePos)
    //   this.perso.setSelected(pixel)
    // }

    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
    this.postProcess.start()
    this.lampe.renderRepere(this.camera)
    this.renderToProcess()
    this.postProcess.end()

    this.effectsList()

    this.postProcess.render()

    const center = this.camera.get2dScreenPoint(
      this.lampe.getPosition(),
      this.screenSize,
    )
    const debug = document.getElementById("debug")
    debug.style.left = `${center[0]}px`
    debug.style.top = `${center[1]}px`
  }

  update() {
    this.lampe.updateRandomPosition()
    this.camera.update()
    this.mngProg.setCameraMatrix(this.camera)
  }

  renderToProcess() {}

  renderBeforeProcess() {}

  effectsList() {}

  setKeyboardInteraction() {}

  onMouseMove(infos) {
    this.mousePos = infos.pos
  }

  onMouseDown(infos) {}

  setMouseInteraction(infos) {
    this.camera.setDraggingPosition(infos)
  }

  getColorPixel(pos) {
    const pixel = new Uint8Array(4)
    this.gl.readPixels(
      pos.x,
      pos.y,
      1,
      1,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      pixel,
    )
    return pixel
  }

  setStart() {
    this.start = true
  }
}
