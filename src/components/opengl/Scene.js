import Camera from "./Camera"
import Lampe from "./Lampe"
import PostProcess from "./PostProcess"
import LoadAssets from "../LoadAssets"
import ManagerTextures from "./ManagerTextures"
import ManagerObjets from "./ManagerObjets"
import ManagerPrograms from "./ManagerPrograms"
import scene from "../../scenes/classic"

export default class {
  constructor(gl) {
    this.gl = gl
    this.camera = new Camera(scene.camera)
    this.assetsReady = false
    this.afterAssetsLoaded = this.afterAssetsLoaded.bind(this)
    this.postProcess = new PostProcess(this.gl, 1024, 1024)
    this.box = null
    this.mousePos = null
    this.lampe = new Lampe(this.gl)
    this.time = 0
    this.mngProg = new ManagerPrograms(this.gl, scene.programs)
    this.one = false

    LoadAssets(scene.assets, this.afterAssetsLoaded)
  }

  afterAssetsLoaded(assets) {
    this.mngTex = new ManagerTextures(this.gl, assets.textures)
    this.mngObj = new ManagerObjets(this.gl, assets.objets)
    this.camera.lookAt()
    this.assetsReady = true
  }

  resize(box) {
    this.camera.perspective(box.width, box.height)
    this.box = box
    this.postProcess.resize(box)
  }

  render() {
    if (this.assetsReady /*&& !this.one*/) {
      this.time++
      this.update()

      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
      this.renderBeforeProcess()

      if (this.mousePos !== null) {
        const pixel = this.getColorPixel(this.mousePos)
        this.perso.setSelected(pixel)
      }

      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
      this.postProcess.start()
      this.lampe.renderRepere(this.camera)
      this.renderToProcess()
      this.postProcess.end()

      // this.postProcess.setFXAA()
      // this.postProcess.setRGB(0.01, 0.01)

      this.gl.viewport(0, 0, this.box.width, this.box.height)
      this.postProcess.render()
      this.one = true
    }
  }

  update() {
    this.lampe.updateRandomPosition()
    this.camera.update()
    this.mngProg.setCameraMatrix(this.camera)
  }

  renderToProcess() {}

  renderBeforeProcess() {}

  onMouseMove(infos) {
    if (this.assetsReady) {
      this.mousePos = infos.pos
    }
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
}
