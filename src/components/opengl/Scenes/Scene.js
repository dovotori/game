import Camera from "../Cameras/CameraSmooth"
import Lampe from "../Lampe"
import ManagerTextures from "../../io/Managers/ManagerTextures"
import ManagerObjets from "../../io/Managers/ManagerObjets"
import ManagerPrograms from "../../io/Managers/ManagerPrograms"

export default class {
  constructor(gl, config, assets) {
    this.gl = gl
    this.camera = new Camera(config.camera)
    this.screenSize = null
    this.mousePos = null
    this.lampe = new Lampe(this.gl, config.lampe)
    this.mngProg = new ManagerPrograms(this.gl, config.programs)
    this.mngTex = new ManagerTextures(this.gl, assets.textures)
    this.mngObj = new ManagerObjets(this.gl, assets.objets)
    this.one = false
    this.start = false
    this.time = 0
  }

  resize(box) {
    this.camera.perspective(box.width, box.height)
    this.screenSize = box
    this.gl.viewport(0, 0, this.screenSize.width, this.screenSize.height)
  }

  render() {
    this.time++
    this.update()
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
    this.renderMain()
  }

  renderMain() {
    this.lampe.renderRepere(this.camera)
  }

  update() {
    this.lampe.updateRandomPosition(this.time)
    this.camera.update()
    this.mngProg.setCameraMatrix(this.camera)
    if (this.start) {
      this.afterStart()
    }
  }

  setKeyboardInteraction() {}

  onMouseMove(infos) {
    this.mousePos = infos.pos
  }

  onMouseDown() {}

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

  getTestPoint() {
    return this.camera.get2dScreenPoint(
      this.lampe.getPositionVec3(),
      this.screenSize,
    )
  }

  setStart() {
    this.start = true
  }

  afterStart() {}
}
