import Mesh from "../opengl/Meshes/MeshColor"
import { mapFromRange } from "../../utils/numbers"

export default class {
  constructor(viewBox, levelSize) {
    this.mountains = new Array(4)
    for (let i = 0; i < this.mountains.length; i++) {
      this.mountains[i] = new Mesh()
    }
    this.clouds = new Array(4)
    this.cloudData = []
    for (let i = 0; i < this.clouds.length; i++) {
      this.clouds[i] = new Mesh()
      this.cloudData[i] = this.setCloud()
    }
    this.viewBox = viewBox
    this.levelSize = levelSize
  }

  update(pos) {
    this.updateMountains(pos)
    this.updateClouds(pos)
  }

  updateMountains(pos) {
    this.mountains.forEach((mesh, idx) => {
      const inverseIdx = this.mountains.length - idx
      const scale = mapFromRange(idx, 0, this.mountains.length, 4, 40)
      const x = mapFromRange(
        pos[0],
        0,
        this.levelSize.w,
        this.viewBox.w + inverseIdx * 10,
        -inverseIdx * 10,
      )
      const y = 10 + scale / 2
      const color = mapFromRange(idx, 0, this.mountains.length, 255, 100)
      const z = -idx - 10

      mesh.update()
      mesh.setScale(scale, scale, scale)
      mesh.setRotate(45, 0, 0, 1)
      mesh.setTranslate(x, y, z)
      mesh.setColor(color, color, color, 1)
    })
  }

  updateClouds(pos) {
    this.clouds.forEach((mesh, idx) => {
      const scale = this.cloudData[idx].scale
      if (this.cloudData[idx].x < -scale) {
        this.cloudData[idx] = this.setCloud(this.viewBox.w + scale)
      } else {
        this.cloudData[idx].x -= this.cloudData[idx].speed
      }
      mesh.update()
      mesh.setScale(scale, scale, scale)
      mesh.setRotate(45, 0, 0, 1)
      mesh.setTranslate(
        this.cloudData[idx].x,
        this.cloudData[idx].y,
        this.cloudData[idx].depth * 10,
      )
      mesh.setColor(255, 255, 255, 1)
    })
  }

  renderMountains(objet, program) {
    this.mountains.forEach(mesh => mesh.render(objet, program))
  }

  renderClouds(objet, program) {
    this.mountains.forEach(mesh => mesh.render(objet, program))
    this.clouds.forEach(mesh => mesh.render(objet, program))
  }

  setCloud(x) {
    return {
      x: x || Math.random() * 10,
      y: 10,
      depth: Math.random(),
      scale: 4 + Math.random() * 4,
      speed: 0.01 + Math.random() * 0.1,
    }
  }
}
