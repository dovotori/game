import Perso from "../game/Perso"
import Tilemap from "../game/Tilemap"
import Scene from "./Scene"
import scene from "../../scenes/classic"

export default class extends Scene {
  constructor(gl) {
    super(gl)
    this.perso = new Perso(this.gl, scene.perso)
  }

  afterAssetsLoaded(assets) {
    super.afterAssetsLoaded(assets)
    this.tilemap = new Tilemap(this.gl, assets.levels.level, scene.tilemap)
  }

  renderBeforeProcess() {
    this.perso.renderColor(this.mngObj.get("tile"), this.mngProg.get("color"))

    if (this.mousePos !== null) {
      const pixel = this.getColorPixel(this.mousePos)
      this.perso.setSelected(pixel)
    }
  }

  renderToProcess() {
    this.mngProg
      .get("spritePhong")
      .setVector("posLum", this.lampe.getPosition().get())
    this.tilemap.render(
      this.mngObj.get("cubeTile"),
      this.mngProg.get("spritePhong"),
      this.mngTex.get("tiles"),
    )
    this.perso.render(
      this.mngObj.get("tile"),
      this.mngProg.get("sprite"),
      this.mngTex.get("heros"),
    )
  }

  update() {
    super.update()
    this.perso.update(this.tilemap.getViewBox(), this.tilemap.get())
    this.tilemap.follow(this.perso.getPosition())
    this.tilemap.update(this.mngProg.get("spritePhong"), this.camera)
  }

  setKeyboardInteraction(interaction) {
    this.perso.setInteraction(interaction.perso, interaction.changed)
  }
}