import Tile from "./Tile"

export default class {
  constructor(gl, img) {
    this.context = this.setupContext(img)
    this.levelSize = { w: img.width, h: img.height }
    this.viewBox = {
      x: 0,
      y: 0,
      w: 10,
      h: 10,
    }
    this.tile = new Tile(gl)
  }

  setupContext(img) {
    const canvas = document.createElement("canvas")
    const context = canvas.getContext("2d")
    canvas.width = img.width
    canvas.height = img.height
    context.drawImage(img, 0, 0)
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

  render(obj, prog, tex) {
    const map = this.getData()
    for (let y = 0; y < map.height; y++) {
      for (let x = 0; x < map.width; x++) {
        const pixel = y * map.height + x
        const r = map.data[pixel * 4]
        const g = map.data[pixel * 4 + 1]
        const b = map.data[pixel * 4 + 2]
        const state = r + "" + g + "" + b
        switch (state) {
          case "25500":
          case "00255":
          case "000":
            const inverseY = map.height - 1 - y
            this.tile.setState(state)
            this.tile.setTranslate(x, inverseY)
            this.tile.render(obj, prog, tex)
            break
          default:
            break
        }
      }
    }
    this.cpt++
  }

  renderTile(x, y) {}

  // var data
  // for (var y = 0; y < image.height; y++) {
  //   for (var x = 0; x < image.width; x++) {
  //     data = context.getImageData(x, y, 1, 1).data
  //     // collision
  //     if (data[0] == 0 && data[1] == 0 && data[2] == 0) {
  //       this.map[x][y] = 0
  //     } else if (data[0] == 0 && data[1] == 0 && data[2] == 255) {
  //       this.map[x][y] = -1
  //     } else if (data[0] == 150 && data[1] == 150 && data[2] == 150) {
  //       this.map[x][y] = -2
  //       // deco
  //     } else if (data[0] == 255 && data[1] == 0 && data[2] == 0) {
  //       this.map[x][y] = 2
  //     } else if (data[0] == 0 && data[1] == 255 && data[2] == 0) {
  //       this.map[x][y] = 3
  //     } else if (data[0] == 0 && data[1] == 200 && data[2] == 0) {
  //       this.map[x][y] = 4
  //     } else if (data[0] == 0 && data[1] == 180 && data[2] == 0) {
  //       this.map[x][y] = 5
  //     } else if (data[0] == 0 && data[1] == 160 && data[2] == 0) {
  //       this.map[x][y] = 6
  //     } else if (data[0] == 0 && data[1] == 140 && data[2] == 0) {
  //       this.map[x][y] = 7
  //       // rien
  //     } else {
  //       this.map[x][y] = 1
  //     }
  //   }
  // }
}
