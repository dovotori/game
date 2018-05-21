import LoadObj from "../LoadObj"

export default class {
  constructor() {
    this.loadObjet = this.loadObjet.bind(this)
    this.loadImage = this.loadImage.bind(this)

    this.assets = {
      textures: {},
      objets: {},
      levels: {},
    }
  }

  async setup(paths) {
    const promesses = await paths.map(async path => {
      const info = this.getAssetInfo(path)
      switch (info.ext) {
        case "jpg":
        case "jpeg":
        case "png":
        case "bmp":
          return await this.loadImage(path, info)
        case "obj":
          return await this.loadObjet(path, info)
        default:
          break
      }
    })
    return await Promise.all(promesses).then(data => {
      data.forEach(item => {
        switch (item.info.ext) {
          case "jpg":
          case "jpeg":
          case "png":
            this.assets.textures[item.info.name] = item.data
            break
          case "bmp":
            this.assets.levels[item.info.name] = item.data
            break
          case "obj":
            this.assets.objets[item.info.name] = item.data
            break
          default:
            break
        }
      })
      return this.assets
    })
  }

  loadImg(path) {
    return new Promise((resolve, reject) => {
      let img = new Image()
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = path
    })
  }

  getAssetInfo(path) {
    const parts = path
      .substring(path.lastIndexOf("/") + 1, path.length)
      .split(".")
    return { name: parts[0], ext: parts[1].toLowerCase() }
  }

  loadObjet(path, info) {
    return fetch(path)
      .then(response => response.text())
      .then(response => {
        const obj = new LoadObj(response)
        return { data: obj.getAllInOne(), info }
      })
  }

  loadImage(path, info) {
    return new Promise((resolve, reject) => {
      let img = new Image()
      img.onload = () => resolve({ data: img, info })
      img.onerror = reject
      img.src = path
    })
  }

  async getAssets(assets) {
    return await assets.map(async asset => {
      const info = this.getAssetInfo(asset)
      switch (info.ext) {
        case "jpg":
        case "jpeg":
        case "png":
        case "bmp":
          return await this.loadImage(asset, info)
        case "obj":
          return await this.loadObjet(asset, info)
      }
    })
  }

  get() {
    return this.assets
  }
}
