import Camera from "./Camera"
import TextureImage from "./TextureImage"
import Lampe from "./Lampe"
import Mesh from "./MeshSprite"
import Fbo from "./Fbo"
import PostProcess from "./PostProcess"
import AssetsManager from "../AssetsManager"
import StateSprite from "../game/StateSprite"
import heros from "../../sprites/heros"

export default class Scene {
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
    this.state.render("STAND")

    const paths = [
      "../../../assets/textures/heros.png",
      "../../../assets/textures/101_norm.jpg",
      "../../../assets/objets/plane.obj",
    ]

    this.assetsManager = new AssetsManager(paths, this.afterAssetsLoaded)
  }

  afterAssetsLoaded(assets) {
    this.textures = []
    this.textures[0] = new TextureImage(this.gl, assets[0])
    this.textures[1] = new TextureImage(this.gl, assets[1])
    this.mesh = new Mesh(this.gl, assets[2])
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
      this.mesh.renderColor()

      if (this.mousePos !== null) {
        const pixel = this.getColorPixel(this.mousePos)
        this.mesh.setSelected(pixel)
      }

      this.postProcess.start()
      this.lampe.renderRepere(this.camera)
      this.mesh.setTexture(0, this.textures[0])
      this.mesh.setTexture(1, this.textures[1])
      this.mesh.start(this.camera)
      this.mesh.render()
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
