import Program from "./Program"
import * as glsl from "../../shaders/"

export default class {
  constructor(gl, selection) {
    this.programs = {}
    for (let name in glsl) {
      if (selection.indexOf(name) !== -1) {
        const shader = glsl[name]
        this.programs[name] = new Program(gl, shader)
      }
    }
  }

  setCameraMatrix(camera) {
    for (let name in this.programs) {
      this.programs[name].setMatrix("view", camera.getView().get())
      this.programs[name].setMatrix("projection", camera.getProjection().get())
    }
  }

  get(id) {
    return this.programs[id]
  }
}
