import Canvas from "./opengl/Canvas"
import SplashScreen from "./SplashScreen"
import Scene from "./opengl/Scenes/SceneGame"
import Loop from "./Loop"
import Keyboard from "./io/Keyboard"
import Mouse from "./io/Mouse"
import ManagerAssets from "./io/Managers/ManagerAssets"
import config from "../constants/config"

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
    this.keyboard = new Keyboard(config.keyboard)
    this.mouse = new Mouse(document.body, this.onMouseDrag)

    this.splash.showTitle()
    this.canvas.resize({
      width: document.body.offsetWidth,
      height: window.innerHeight,
    })

    this.am = new ManagerAssets(config.assets)
    this.am.setup(config.assets).then(this.ready)
  }

  ready(assets) {
    this.scene = new Scene(this.canvas.getContext(), config, assets)
    window.addEventListener("resize", this.resize, false)
    this.resize()

    if (config.splashscreen) {
      this.loop = new Loop(this.renderSplash)
      this.splash.showReady()
    } else {
      this.loop = new Loop(this.renderGame)
      this.startGame()
    }
  }

  onMouseDrag(data) {
    this.scene.setMouseInteraction(data)
  }

  renderSplash() {
    this.keyboard.render()
    this.scene.render()

    if (this.keyboard.getKey(13)) {
      this.startGame()
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

    // TEST 2D POINT
    const center = this.scene.getTestPoint()
    const debug = document.getElementById("debug")
    debug.style.left = `${center[0]}px`
    debug.style.top = `${center[1]}px`
    debug.innerHTML = `x: ${center[0]}px / y: ${center[1]}px`
  }

  startGame() {
    this.splash.hide()
    this.loop.setCallback(this.renderGame)
    this.scene.setStart()
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
