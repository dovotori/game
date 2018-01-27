import Camera from "./Camera"
// import Program from "./Program"
// import Objet from "./Objet"
// import Texture from "./Texture"
// import Mat4 from "../geometrie/Mat4"
// import texture from "../../shaders/texture"
// import plane from "../../primitives/plane"
import Mesh from "./Mesh"
import Fbo from "./Fbo"
import AssetsManager from "../AssetsManager"

export default class Scene {
  constructor(gl) {
    this.gl = gl
    this.camera = new Camera()
    this.camera.setPosition(-4, -4, -4)
    this.isLoaded = false
    this.afterAssetsLoaded = this.afterAssetsLoaded.bind(this)
    this.fbo = new Fbo(this.gl, 1024, 1024)
    this.box = null
    this.mesh = new Mesh(this.gl)

    const paths = [
      "../../../assets/textures/snow.jpg",
      "../../../assets/textures/land.jpg",
    ]

    this.assetsManager = new AssetsManager()
    // this.assetsManager.getAssets(paths).then(this.afterAssetsLoaded)
  }

  afterAssetsLoaded(assets) {
    this.isLoaded = true
    console.log(assets)
  }

  onResize(box) {
    this.camera.perspective(box.width, box.height)
    this.box = box
  }

  render() {
    this.update()

    this.camera.lookAt()
    this.mesh.start(this.camera)

    this.mesh.render()
    // this.fbo.start()
    // this.fbo.end()
  }

  update() {
    this.mesh.update()
  }

  onMouseMove(infos) {
    const pixel = this.getColorPixel(infos.pos)
    this.mesh.setSelected(pixel)
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
