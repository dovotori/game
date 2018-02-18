import Canvas from "./opengl/Canvas"
import Scene from "./opengl/SceneGame"
import Loop from "./Loop"
import Keyboard from "./Keyboard"
import Mouse from "./Mouse"

export default class {
  constructor(options) {
    this.canvas = new Canvas()
    this.scene = new Scene(this.canvas.getContext())
    this.keyboard = new Keyboard()

    this.onMouseDrag = this.onMouseDrag.bind(this)
    this.render = this.render.bind(this)
    this.resize = this.resize.bind(this)
    window.addEventListener("resize", this.resize, false)
    this.resize()

    this.mouse = new Mouse(document.body, this.onMouseDrag)
    this.loop = new Loop(this.render)
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
      },
    }

    this.keyboard.render()
    this.scene.setKeyboardInteraction(interaction)
    this.scene.render()
  }

  resize() {
    const box = {
      width: document.body.offsetWidth,
      height: window.innerHeight,
    }
    this.canvas.resize(box)
    this.scene.resize(box)
  }

  getCanvas() {
    return this.canvas.get()
  }
}
