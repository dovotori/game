import TextureImage from "./TextureImage"

export default class {
  constructor(gl, textures) {
    this.textures = textures.map(texture => new TextureImage(gl, texture))
  }

  get(id) {
    return this.textures[id]
  }
}
