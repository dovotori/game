import Heros from "../../game/Persos/Heros"
import Monster from "../../game/Persos/Monster"
import Background from "../../game/Background"
import Tilemap from "../../game/Tilemap"
import Scene from "./Scene"
import scene from "../../../constants/scenes/classic"
import Target from "../../geometry/Target"

export default class extends Scene {
  constructor(gl, scene, callbackLoaded = null) {
    super(gl, scene)
    this.callbackLoaded = callbackLoaded
    this.targetRGB = new Target(0, 0.1)
  }

  afterAssetsLoaded(assets) {
    super.afterAssetsLoaded(assets)
    this.tilemap = new Tilemap(assets.levels.level1, scene.tilemap)
    this.heros = new Heros(this.tilemap.getViewBox(), this.tilemap.get())
    this.monster = new Monster(this.tilemap.getViewBox(), this.tilemap.get())
    this.background = new Background(
      this.tilemap.getViewBox(),
      this.tilemap.getLevelSize(),
    )
    if (this.callbackLoaded) {
      this.callbackLoaded()
    }
  }

  renderBeforeProcess() {
    this.heros.renderColor(this.mngObj.get("tile"), this.mngProg.get("color"))
    if (this.mousePos !== null) {
      const pixel = this.getColorPixel(this.mousePos)
      this.heros.setSelected(pixel)
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
    this.heros.render(
      this.mngProg.get("sprite"),
      this.mngTex.get("heros"),
      this.mngObj.get("tile"),
    )
    this.monster.render(
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
    this.tilemap.follow(this.heros.getBehaviorPosition()) // should be before perso update

    if (this.start) {
      this.afterStart()
    }
    // this.tilemap.follow(this.monster.getBehaviorPosition())
    this.tilemap.update(this.mngProg.get("spritePhong"), this.camera)
    this.background.update(this.heros.getBehaviorPosition())
  }

  afterStart() {
    this.targetRGB.update()
    if (this.heros.getInverseX()) {
      this.camera.setSmoothRotation(0.1)
      this.camera.setSmoothTarget(-4)
    } else {
      this.camera.setSmoothRotation(-0.1)
      this.camera.setSmoothTarget(4)
    }
    if (this.heros.getAiming()) {
      this.camera.setSmoothZoom(0.9)
    } else {
      this.camera.setSmoothZoom(1)
    }
    if (this.heros.getDashing()) {
      this.targetRGB.set(1)
    } else {
      this.targetRGB.set(0)
    }
    this.heros.update()
    this.monster.update(this.tilemap.getSmoothTilePos())
  }

  effectsList() {
    this.postProcess.setFXAA()
    this.postProcess.setRGB(this.targetRGB.get(), 0)
  }

  setKeyboardInteraction(interaction) {
    if (this.assetsReady) {
      this.heros.setInteraction(interaction.perso, interaction.changed)
    }
  }
}
