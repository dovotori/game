import Canvas from "./opengl/Canvas"
import Scene from "./opengl/SceneCollision"
import Loop from "./Loop"
import Keyboard from "./Keyboard"
import Mouse from "./Mouse"
import scene from "../scenes/classic"

export default class {
  constructor(options) {
    this.canvas = new Canvas()
    this.keyboard = new Keyboard(scene.keyboard)

    this.onMouseDrag = this.onMouseDrag.bind(this)
    this.ready = this.ready.bind(this)
    this.render = this.render.bind(this)
    this.resize = this.resize.bind(this)
    this.ready = this.ready.bind(this)

    this.scene = new Scene(this.canvas.getContext(), scene, this.ready)
    this.mouse = new Mouse(document.body, this.onMouseDrag)
    this.loop = new Loop(this.render)

    this.showTitle()
    window.addEventListener("resize", this.resize, false)
    this.resize()
  }

  showTitle() {
    const title = document.getElementById("title")
    if (title) {
      title.style.opacity = 1
      title.style.transform = "none"
    }
  }

  removeSplash() {
    const splash = document.getElementById("splash")
    if (splash) {
      splash.style.opacity = 0
    }
  }

  onMouseDrag(data) {
    this.scene.setMouseInteraction(data)
  }

  render() {
    const interaction = {
      changed: this.keyboard.hasChanged(),
      perso: {
        UP: this.keyboard.getKey(38),
        DOWN: this.keyboard.getKey(40),
        LEFT: this.keyboard.getKey(37),
        RIGHT: this.keyboard.getKey(39),
        SPACE: this.keyboard.getKey(32),
        SHIFT: this.keyboard.getKey(16),
        X: this.keyboard.getKey(88),
        W: this.keyboard.getKey(87),
      },
    }

    this.keyboard.render()
    this.scene.setKeyboardInteraction(interaction)
    this.scene.render()

    if (this.keyboard.getKey(13)) {
      this.scene.setStart()
      this.removeSplash()
    }
  }

  resize() {
    const box = {
      width: document.body.offsetWidth,
      height: window.innerHeight,
    }
    this.canvas.resize(box)
    this.scene.resize(box)
  }

  ready() {
    const intro = document.getElementById("instructions")
    const loader = document.getElementById("loader")
    if (loader) loader.style.display = "none"
    if (intro) intro.style.display = "block"
  }

  getCanvas() {
    return this.canvas.get()
  }
}
