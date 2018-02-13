import TextureImage from "./TextureImage"

export default class {
  constructor(gl, textures) {
    this.textures = {}
    for (let name in textures) {
      this.textures[name] = new TextureImage(gl, textures[name])
    }
  }

  get(id) {
    return this.textures[id]
  }
}
