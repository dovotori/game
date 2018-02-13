import LoadObj from "./LoadObj"

export default class {
  constructor(paths, callback) {
    this.callback = callback
    this.assets = {
      textures: {},
      objets: {},
      levels: {},
    }
    this.loadingCpt = paths.length
    // this.fetchAsset = this.fetchAsset.bind(this)
    this.loadOne = this.loadOne.bind(this)
    this.loadObj = this.loadObj.bind(this)

    paths.forEach(path => {
      const parts = path
        .substring(path.lastIndexOf("/") + 1, path.length)
        .split(".")
      const name = parts[0]
      const extension = parts[1].toLowerCase()
      switch (extension) {
        case "jpg":
        case "jpeg":
        case "png":
        case "bmp":
          this.loadImage(extension, name, path)
          break
        case "obj":
          this.fetchAsset(extension, name, path)
          break
      }
    })
  }

  loadImage(extension, name, path) {
    const image = new Image()
    image.addEventListener("load", this.loadOne, false)
    image.src = path
    if (extension !== "bmp") {
      this.assets.textures[name] = image
    } else {
      this.assets.levels[name] = image
    }
  }

  loadObj(name, data) {
    const obj = new LoadObj(data)
    this.assets.objets[name] = obj.getAllInOne()
    this.loadOne()
  }

  loadOne() {
    this.loadingCpt--
    if (this.loadingCpt == 0) {
      this.callback(this.assets)
    }
  }

  fetchAsset(extension, name, path) {
    return fetch(path)
      .then(response => response.text())
      .then(response => {
        switch (extension) {
          default:
          case "obj":
            this.loadObj(name, response)
            break
        }
      })
  }
}
