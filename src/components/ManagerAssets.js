import LoadObj from "./LoadObj"

export default class {
  constructor(paths, callback) {
    this.callback = callback
    this.objets = []
    this.textures = []
    this.loadingCpt = paths.length
    // this.fetchAsset = this.fetchAsset.bind(this)
    this.loadOne = this.loadOne.bind(this)
    this.loadObj = this.loadObj.bind(this)

    paths.forEach(path => {
      const extension = path
        .substring(path.lastIndexOf(".") + 1, path.length)
        .toLowerCase()
      switch (extension) {
        case "jpg":
        case "jpeg":
        case "png":
          this.loadImage(path)
          break
        case "obj":
          this.fetchAsset(path)
          break
      }
    })
  }

  loadImage(path) {
    const image = new Image()
    image.addEventListener("load", this.loadOne, false)
    image.src = path
    this.textures.push(image)
  }

  loadObj(data) {
    const obj = new LoadObj(data)
    this.objets.push(obj.getAllInOne())
    this.loadOne()
  }

  loadOne() {
    this.loadingCpt--
    if (this.loadingCpt == 0) {
      this.callback(this.textures, this.objets)
    }
  }

  fetchAsset(path) {
    return fetch(path)
      .then(response => response.text())
      .then(this.loadObj)
  }
}
