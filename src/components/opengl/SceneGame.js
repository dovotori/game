import Perso from "../game/Perso"
import Tilemap from "../game/Tilemap"
import Scene from "./Scene"

export default class extends Scene {
  constructor(gl) {
    super(gl)
    this.perso = new Perso(this.gl)
  }

  afterAssetsLoaded(assets) {
    super.afterAssetsLoaded(assets)
    this.tilemap = new Tilemap(this.gl, assets.levels.level)
  }

  renderBeforeProcess() {
    this.perso.renderColor(this.mngObj.get("tile"), this.mngProg.get("color"))

    if (this.mousePos !== null) {
      const pixel = this.getColorPixel(this.mousePos)
      this.perso.setSelected(pixel)
    }
  }

  renderToProcess() {
    this.tilemap.render(
      this.mngObj.get("tile"),
      this.mngProg.get("sprite"),
      this.mngTex.get("tiles"),
    )
    this.perso.render(
      this.mngObj.get("tile"),
      this.mngProg.get("sprite"),
      this.mngTex.get("heros"),
    )
  }

  update() {
    this.perso.update()
  }

  setDraggingInfos(infos) {
    if (this.box !== null) {
      this.perso.setDraggingInfos(infos)
    }
  }
}
