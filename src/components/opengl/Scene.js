import Camera from "./Camera"
import Program from "./Program"
import Objet from "./Objet"
import Texture from "./Texture"
import AssetsManager from "../AssetsManager"
import texture from "../../shaders/texture"
import { plane } from "../../primitives"

export default class Scene {
  constructor(gl) {
    this.gl = gl
    this.program = new Program(this.gl, texture)
    this.objet = new Objet(this.gl)
    this.objet.setPoints(plane, "position")
    this.camera = new Camera()
    this.camera.setPosition(-2, -2, -2)
    this.isLoaded = false
    this.afterAssetsLoaded = this.afterAssetsLoaded.bind(this)
    this.texture = new Texture(this.gl)

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
  }

  render() {
    this.camera.lookAt()
    this.program.setMatrix("model", this.camera.getMatriceIdentity())
    this.program.setMatrix("view", this.camera.getView())
    this.program.setMatrix("projection", this.camera.getProjection())
    this.program.setTexture("tex0", this.texture.get())
    this.objet.render(this.program.get())
  }
}
