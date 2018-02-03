import Camera from "./Camera"
// import Program from "./Program"
// import Objet from "./Objet"
import TextureImage from "./TextureImage"
// import Mat4 from "../geometrie/Mat4"
// import texture from "../../shaders/texture"
// import plane from "../../primitives/plane"
import Mesh from "./Mesh"
import Screen from "./Screen"
import Fbo from "./Fbo"
import PostProcess from "./PostProcess"
import AssetsManager from "../AssetsManager"

export default class Scene {
  constructor(gl) {
    this.gl = gl
    this.camera = new Camera()
    this.camera.setPosition(4, 4, 4)
    this.camera.setNearFar(1.0, 1000.0)
    this.assetsReady = false
    this.afterAssetsLoaded = this.afterAssetsLoaded.bind(this)
    this.postProcess = new PostProcess(this.gl, 1024, 1024)
    this.box = null
    this.mousePos = null

    const paths = [
      "../../../assets/textures/165.jpg",
      "../../../assets/textures/165_norm.jpg",
      "../../../assets/objets/sphere.obj",
    ]

    this.assetsManager = new AssetsManager(paths, this.afterAssetsLoaded)
  }

  afterAssetsLoaded(assets) {
    console.log(assets)
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

      this.mesh.setTexture(0, this.textures[0])
      this.mesh.setTexture(1, this.textures[1])
      this.mesh.start(this.camera)

      this.postProcess.start()
      this.mesh.render()
      this.postProcess.end()

      this.gl.viewport(0, 0, this.box.width, this.box.height)
      this.postProcess.render()
    }
  }

  update() {
    this.mesh.update()
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
