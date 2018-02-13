import Canvas from "./opengl/Canvas"
import Scene from "./opengl/SceneGame"
import Loop from "./Loop"
import Keyboard from "./Keyboard"

export default class {
  constructor(options) {
    this.canvas = new Canvas()
    this.scene = new Scene(this.canvas.getContext())
    this.keyboard = new Keyboard()

    this.render = this.render.bind(this)
    this.resize = this.resize.bind(this)
    window.addEventListener("resize", this.resize, false)
    this.resize()

    this.loop = new Loop(this.render)
  }

  render() {
    const interaction = {
      changed: this.keyboard.hasChanged(),
      perso: {
        UP: this.keyboard.getKey(38),
        LEFT: this.keyboard.getKey(37),
        RIGHT: this.keyboard.getKey(39),
        SPACE: this.keyboard.getKey(32),
        SHIFT: this.keyboard.getKey(16),
        X: this.keyboard.getKey(88),
      },
    }

    this.keyboard.render()
    this.scene.setInteraction(interaction)
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
