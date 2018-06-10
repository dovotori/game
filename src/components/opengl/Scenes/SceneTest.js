import Camera from "../Cameras/CameraCoordinatesConversion"
import ManagerTextures from "../../io/Managers/ManagerTextures"
import ManagerObjets from "../../io/Managers/ManagerObjets"
import ManagerPrograms from "../../io/Managers/ManagerPrograms"
import MeshRepere from "../Meshes/MeshRepere"
import { Vec3 } from "../../geometry"

export default class {
  constructor(gl, config, assets) {
    this.gl = gl
    this.camera = new Camera(config.camera)
    this.screenSize = null
    this.mousePos = null
    this.time = 0
    this.mngProg = new ManagerPrograms(this.gl, config.programs)
    this.mngTex = new ManagerTextures(this.gl, assets.textures)
    this.mngObj = new ManagerObjets(this.gl, assets.objets)
    this.repere = new MeshRepere(this.gl)
    this.position = new Vec3(0, 0, 0)
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
    this.repere.render(this.camera)
  }

  update() {
    this.position.setX(Math.cos(this.time * 0.01) * 10)
    this.position.setY(Math.sin(this.time * 0.01) * 10)
    this.repere.update(this.position)
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
    return this.camera.get2dScreenPoint(this.position, this.screenSize)
  }

  afterStart() {}
}
