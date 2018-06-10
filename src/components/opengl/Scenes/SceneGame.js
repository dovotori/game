import Heros from "../../game/Persos/Heros"
import Monster from "../../game/Persos/Monster"
import Background from "../../game/Background"
import Tilemap from "../../game/Tilemap"
import Scene from "./Scene"

export default class extends Scene {
  constructor(gl, config, assets) {
    super(gl, config, assets)
    this.tilemap = new Tilemap(assets.levels.level1, config.tilemap)
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

  // renderBeforeProcess() {
  //   this.heros.renderColor(this.mngObj.get("tile"), this.mngProg.get("color"))
  //   if (this.mousePos !== null) {
  //     const pixel = this.getColorPixel(this.mousePos)
  //     this.heros.setSelected(pixel)
  //   }
  // }

  renderMain() {
    super.renderMain()
    this.background.renderMountains(
      this.mngObj.get("tile"),
      this.mngProg.get("color"),
    )
    this.mngProg
      .get("spritePhong")
      .setVector("posLum", this.lampe.getPosition())
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
    // this.tilemap.follow(this.monster.getBehaviorPosition())
    this.tilemap.update(this.mngProg.get("spritePhong"), this.camera)
    this.background.update(this.heros.getBehaviorPosition())
  }

  afterStart() {
    super.afterStart()
    this.heros.update()
    this.monster.update(this.tilemap.getSmoothTilePos())
    // if (this.mousePos !== null) {
    //   const pixel = this.getColorPixel(this.mousePos)
    //   this.perso.setSelected(pixel)
    // }
  }

  setKeyboardInteraction(interaction) {
    super.setKeyboardInteraction()
    this.heros.setInteraction(interaction.perso, interaction.changed)
  }
}
