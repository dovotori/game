import Program from "./Program"
import * as glsl from "../../shaders/"

export default class {
  constructor(gl) {
    this.programs = {}
    for (let name in glsl) {
      const shader = glsl[name]
      this.programs[name] = new Program(gl, shader)
    }
  }

  get(id) {
    return this.programs[id]
  }
}
