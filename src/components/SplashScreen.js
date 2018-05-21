export default class {
  constructor() {}

  show() {}

  hide() {
    const splash = document.getElementById("splash")
    if (splash) {
      splash.style.opacity = 0
    }
  }

  showTitle() {
    const title = document.getElementById("title")
    if (title) {
      title.style.opacity = 1
      title.style.transform = "none"
    }
  }

  showReady() {
    const intro = document.getElementById("instructions")
    const loader = document.getElementById("loader")
    if (loader) loader.style.display = "none"
    if (intro) intro.style.display = "block"
  }
}
