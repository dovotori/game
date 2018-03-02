import Tile from "./TileNormalMatrix"
import sprite from "../../sprites/tiles"

export default class {
  constructor(img, box) {
    this.context = this.setupContext(img)
    this.levelSize = { w: img.width, h: img.height }
    this.viewBox = {
      x: 0,
      y: 0,
      w: box.w || 20,
      h: box.h || 20,
    }
    this.scrollBox = {
      w: this.viewBox.w / 2,
      h: this.viewBox.h / 2,
    }
    this.smoothTilePos = {
      x: 0,
      y: 0,
    }
    this.tile = new Tile(sprite)
    this.sprite = sprite
  }

  setupContext(img) {
    const canvas = document.createElement("canvas")
    const context = canvas.getContext("2d")
    canvas.width = img.width
    canvas.height = img.height
    context.drawImage(img, 0, 0)
    // document.body.appendChild(canvas)
    return context
  }

  getData() {
    return this.context.getImageData(
      this.viewBox.x,
      this.viewBox.y,
      this.viewBox.w,
      this.viewBox.h,
    )
  }

  update(program, camera) {
    this.tile.setNormalMatrix(program, camera)
  }

  render(prog, tex, obj, flat) {
    const map = this.getData()
    let cpt = 0
    for (let y = 0; y < map.height; y++) {
      for (let x = 0; x < map.width; x++) {
        const pixel = y * map.width + x
        const r = map.data[pixel * 4]
        const g = map.data[pixel * 4 + 1]
        const b = map.data[pixel * 4 + 2]
        const state = r + "" + g + "" + b
        let translate = {
          x: x - this.smoothTilePos.x,
          y: y - this.smoothTilePos.y,
          z: 0,
        }
        let scale = { x: 1, y: 1, z: 1 }
        let finalObjet = flat
        this.tile.reset()
        switch (state) {
          case "25500":
          case "00255":
            break
          case "02550":
            scale = { x: 3, y: 3, z: 3 }
            translate.z = -0.5
            break
          case "02500":
            scale = { x: 2, y: 2, z: 2 }
            translate.z = -0.25
            break
          case "02000":
            scale = { x: 4, y: 4, z: 4 }
            translate.z = 0.25
            break
          case "01500":
            scale = { x: 2, y: 2, z: 1 }
            translate.z = 0.1
            break
          case "01000":
            scale = { x: 3, y: 3, z: 3 }
            translate.z = 0.5
            break
          case "150150150":
          case "000":
            finalObjet = obj
            break
          default:
            break
        }

        if (this.sprite[state]) {
          this.tile.setScale(scale.x, scale.y, scale.z)
          translate.x -= scale.x * 0.5 - 0.5
          translate.y += scale.y - 1
          this.tile.setTranslate(translate.x, translate.y, translate.z)
          this.tile.setState(state)
          this.tile.render(finalObjet, prog, tex)
        }
      }
    }
  }

  follow(pos) {
    let offsetX = pos[0] - this.scrollBox.w
    if (offsetX < 0) offsetX = 0
    if (offsetX > this.levelSize.w - this.viewBox.w)
      offsetX = this.levelSize.w - this.viewBox.w
    let offsetY = pos[1] - this.scrollBox.h
    if (offsetY < 0) offsetY = 0
    if (offsetY > this.levelSize.h - this.viewBox.h)
      offsetY = this.levelSize.h - this.viewBox.h
    this.viewBox.x = offsetX
    this.viewBox.y = offsetY
    this.smoothTilePos.x = offsetX - Math.floor(offsetX)
    this.smoothTilePos.y = offsetY - Math.floor(offsetY)
  }

  getViewBox() {
    return this.viewBox
  }

  getLevelSize() {
    return this.levelSize
  }

  get() {
    return this.context
  }
}
