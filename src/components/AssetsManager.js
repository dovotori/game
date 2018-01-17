export default class AssetsManager {
  constructor(paths) {
    this.loadingCpt = 0
    this.fetchAsset = this.fetchAsset.bind(this)
  }

  fetchAsset(path) {
    this.loadingCpt++
    return fetch(path).then(response => response.blob())
  }

  async getAssets(paths) {
    const assets = []
    for (let i = 0; i < paths.length; i++) {
      assets[i] = await this.fetchAsset(paths[i])
    }
    return assets
  }
}
