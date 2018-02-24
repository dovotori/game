import Mesh from "../opengl/MeshColor"
import { mapFromRange } from "../../utils/numbers"

export default class {
  constructor(gl) {
    this.mountains = new Array(4)
    for (let i = 0; i < this.mountains.length; i++) {
      this.mountains[i] = new Mesh(gl)
    }
    this.clouds = new Array(4)
    this.cloudData = []
    for (let i = 0; i < this.clouds.length; i++) {
      this.clouds[i] = new Mesh(gl)
      this.cloudData[i] = this.setCloud()
    }
  }

  update(pos, size, view) {
    this.mountains.forEach((mesh, idx) => {
      const inverseIdx = this.mountains.length - idx
      const scale = mapFromRange(idx, 0, this.mountains.length, 4, 40)
      const depth = mapFromRange(inverseIdx, 0, this.mountains.length, -10, -20)
      const x = mapFromRange(pos[0], 0, size.w, view.w + scale, -scale)
      const y = 10 + scale / 2
      const color = mapFromRange(idx, 0, this.mountains.length, 255, 100)
      mesh.update()
      mesh.setScale(scale, scale, scale)
      mesh.setRotate(45, 0, 0, 1)
      mesh.setTranslate(x, y, depth)
      mesh.setColor(color, color, color, 1)
      // console.log(idx, depth, scale)
    })

    this.clouds.forEach((mesh, idx) => {
      const scale = this.cloudData[idx].scale
      // const color = mapFromRange(idx, 0, this.mountains.length, 255, 100)
      if (this.cloudData[idx].x < -scale) {
        this.cloudData[idx] = this.setCloud(view.w + scale)
      } else {
        this.cloudData[idx].x -= this.cloudData[idx].speed
      }
      mesh.update()
      mesh.setScale(scale, scale, scale)
      mesh.setRotate(45, 0, 0, 1)
      mesh.setTranslate(
        this.cloudData[idx].x,
        this.cloudData[idx].y * size.w,
        this.cloudData[idx].depth * 10,
      )
      mesh.setColor(255, 255, 255, 1)
      // console.log(idx, depth, scale)
    })
  }

  render(objet, program) {
    // console.log("rendu")
    this.mountains.forEach(mesh => mesh.render(objet, program))
    this.clouds.forEach(mesh => mesh.render(objet, program))
  }

  setCloud(x) {
    return {
      x: x || Math.random() * 10,
      y: Math.random(),
      depth: Math.random(),
      scale: 4 + Math.random() * 4,
      speed: 0.1 + Math.random() * 0.5,
    }
  }
}
