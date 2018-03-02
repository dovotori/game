import Perso from "../game/Heros"
import Background from "../game/Background"
import Tilemap from "../game/Tilemap"
import Scene from "./Scene"
import scene from "../../scenes/classic"
import Target from "../Target"

export default class extends Scene {
  constructor(gl, scene, callbackLoaded = null) {
    super(gl, scene)
    this.callbackLoaded = callbackLoaded
    this.targetRGB = new Target(0, 0.1)
  }

  afterAssetsLoaded(assets) {
    super.afterAssetsLoaded(assets)
    this.tilemap = new Tilemap(assets.levels.level1, scene.tilemap)
    this.perso = new Perso(this.tilemap.getViewBox(), this.tilemap.get())
    this.background = new Background(
      this.tilemap.getViewBox(),
      this.tilemap.getLevelSize(),
    )
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
    this.background.renderMountains(
      this.mngObj.get("tile"),
      this.mngProg.get("color"),
    )
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
    // this.background.renderClouds(
    //   this.mngObj.get("tile"),
    //   this.mngProg.get("color"),
    // )
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
    if (this.start) {
      this.perso.update()
    }
    this.tilemap.follow(this.perso.getBehaviorPosition())
    this.tilemap.update(this.mngProg.get("spritePhong"), this.camera)
    this.background.update(this.perso.getBehaviorPosition())
  }

  effectsList() {
    // this.postProcess.setFXAA()
    this.postProcess.setRGB(this.targetRGB.get(), 0)
  }

  setKeyboardInteraction(interaction) {
    if (this.assetsReady) {
      this.perso.setInteraction(interaction.perso, interaction.changed)
    }
  }
}
