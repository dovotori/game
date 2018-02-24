import Perso from "../game/Heros"
import Background from "../game/Background"
import Tilemap from "../game/Tilemap"
import Scene from "./Scene"
import scene from "../../scenes/classic"
import Target from "../Target"

export default class extends Scene {
  constructor(gl, callbackLoaded = null) {
    super(gl)
    this.perso = new Perso(this.gl)
    this.background = new Background(this.gl)
    this.callbackLoaded = callbackLoaded
    this.targetRGB = new Target(0, 0.1)
  }

  afterAssetsLoaded(assets) {
    super.afterAssetsLoaded(assets)
    this.tilemap = new Tilemap(this.gl, assets.levels.level1, scene.tilemap)
    if (this.callbackLoaded) {
      this.callbackLoaded()
    }
  }

  renderBeforeProcess() {
    this.perso.renderColor(this.mngObj.get("tile"), this.mngProg.get("color"))

    if (this.mousePos !== null) {
      const pixel = this.getColorPixel(this.mousePos)
      this.perso.setSelected(pixel)
    }
  }

  renderToProcess() {
    this.background.render(this.mngObj.get("tile"), this.mngProg.get("color"))
    this.mngProg
      .get("spritePhong")
      .setVector("posLum", this.lampe.getPosition().get())
    this.tilemap.render(
      this.mngProg.get("spritePhong"),
      this.mngTex.get("tiles"),
      this.mngObj.get("cubeTile"),
      this.mngObj.get("tile"),
    )
    this.perso.render(
      this.mngProg.get("sprite"),
      this.mngTex.get("heros"),
      this.mngObj.get("tile"),
    )
  }

  update() {
    super.update()
    this.targetRGB.update()
    if (this.perso.getInverseX()) {
      this.camera.setRotation(0.1)
    } else {
      this.camera.setRotation(-0.1)
    }
    if (this.perso.getAiming()) {
      this.camera.setZoom(0.9)
    } else {
      this.camera.setZoom(1)
    }
    if (this.perso.getDashing()) {
      this.targetRGB.set(1)
    } else {
      this.targetRGB.set(0)
    }
    this.perso.update(this.tilemap.getViewBox(), this.tilemap.get())
    this.tilemap.follow(this.perso.getPosition())
    this.tilemap.update(this.mngProg.get("spritePhong"), this.camera)
    this.background.update(
      this.perso.getPosition(),
      this.tilemap.getLevelSize(),
      this.tilemap.getViewBox(),
    )
  }

  effectsList() {
    this.postProcess.setFXAA()
    this.postProcess.setRGB(this.targetRGB.get(), 0)
  }

  setKeyboardInteraction(interaction) {
    this.perso.setInteraction(interaction.perso, interaction.changed)
  }
}
