import Canvas from "./opengl/Canvas"
import SplashScreen from "./SplashScreen"
import Scene from "./opengl/Scenes/SceneCollision"
import Loop from "./Loop"
import Keyboard from "./io/Keyboard"
import Mouse from "./io/Mouse"
import ManagerAssets from "./io/Managers/ManagerAssets"
import scene from "../constants/scenes/classic"

export default class {
  constructor() {
    this.onMouseDrag = this.onMouseDrag.bind(this)
    this.renderGame = this.renderGame.bind(this)
    this.renderSplash = this.renderSplash.bind(this)
    this.resize = this.resize.bind(this)
    this.ready = this.ready.bind(this)

    this.setup()
  }

  setup() {
    this.canvas = new Canvas()
    this.splash = new SplashScreen()
    this.keyboard = new Keyboard(scene.keyboard)
    this.mouse = new Mouse(document.body, this.onMouseDrag)

    this.splash.showTitle()
    this.canvas.resize({
      width: document.body.offsetWidth,
      height: window.innerHeight,
    })

    this.am = new ManagerAssets(scene.assets)
    this.am.setup(scene.assets).then(this.ready)
  }

  ready(assets) {
    this.scene = new Scene(this.canvas.getContext(), scene, assets)
    this.loop = new Loop(this.renderSplash)
    window.addEventListener("resize", this.resize, false)
    this.resize()
    this.splash.showReady()
  }

  onMouseDrag(data) {
    this.scene.setMouseInteraction(data)
  }

  renderSplash() {
    this.keyboard.render()
    this.scene.render()

    if (this.keyboard.getKey(13)) {
      this.splash.hide()
      this.loop.setCallback(this.renderGame)
      this.scene.setStart()
    }
  }

  renderGame() {
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
