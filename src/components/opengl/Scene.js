import Camera from "./Camera"
import TextureImage from "./TextureImage"
import Lampe from "./Lampe"
import Mesh from "./MeshSprite"
import PostProcess from "./PostProcess"
import LoadAssets from "../LoadAssets"
import ManagerTextures from "./ManagerTextures"
import ManagerObjets from "./ManagerObjets"
import ManagerPrograms from "./ManagerPrograms"
import StateSprite from "../game/StateSprite"
import heros from "../../sprites/heros"
import scene from "../../scenes/classic"

export default class {
  constructor(gl) {
    this.gl = gl
    this.camera = new Camera()
    this.camera.setPosition(0, 0, 10)
    this.camera.setNearFar(1.0, 100.0)
    this.assetsReady = false
    this.afterAssetsLoaded = this.afterAssetsLoaded.bind(this)
    this.postProcess = new PostProcess(this.gl, 1024, 1024)
    this.box = null
    this.mousePos = null
    this.lampe = new Lampe(this.gl)
    this.time = 0
    this.state = new StateSprite(heros)
    this.state.set("DIE")
    this.mesh = new Mesh(this.gl)
    this.mngProg = new ManagerPrograms(this.gl)

    LoadAssets(scene.assets, this.afterAssetsLoaded)
  }

  afterAssetsLoaded(textures, objets) {
    this.mngTex = new ManagerTextures(this.gl, textures)
    this.mngObj = new ManagerObjets(this.gl, objets)
    this.assetsReady = true
  }

  onResize(box) {
    this.camera.perspective(box.width, box.height)
    this.box = box
    this.postProcess.resize(box)
  }

  render() {
    if (this.assetsReady) {
      this.update()

      this.camera.lookAt()
      this.mesh.startColor(this.camera)
      this.mesh.renderColor(this.mngObj.get(0))

      if (this.mousePos !== null) {
        const pixel = this.getColorPixel(this.mousePos)
        this.mesh.setSelected(pixel)
      }

      this.postProcess.start()
      this.lampe.renderRepere(this.camera)
      this.mesh.setTexture(0, this.mngTex.get(0))
      this.mesh.setTexture(1, this.mngTex.get(1))
      this.mesh.start(this.camera)
      this.mesh.render(this.mngObj.get(0))
      this.postProcess.end()

      this.postProcess.setFXAA()

      this.gl.viewport(0, 0, this.box.width, this.box.height)
      this.postProcess.render()
    }
  }

  update() {
    this.time++
    this.mesh.update()
    this.mesh.setLightPos(this.lampe.getPosition())
    this.lampe.updateRandomPosition()
    this.mesh.setSprite(this.state.get())
  }

  onMouseMove(infos) {
    if (this.assetsReady) {
      this.mousePos = infos.pos
    }
  }

  onMouseDown(infos) {}

  setDraggingInfos(infos) {
    if (this.box !== null) {
      this.mesh.setDraggingInfos(infos)
    }
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
