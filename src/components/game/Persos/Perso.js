import StateSprite from "../StateSprite"
import MeshSprite from "../../opengl/Meshes/MeshSprite"
import Behavior from "../Behaviors/Behavior"
import Vec3 from "../../geometry/Vec3"
import constants from "../../../constants/persos/heros"

export default class extends MeshSprite {
  constructor(states, viewBox, map) {
    super()
    this.inverseX = false
    this.cornerLeft = false
    this.position = new Vec3(
      constants.x || 0,
      constants.y || 0,
      constants.z || 0,
    )

    this.updateState = this.updateState.bind(this)
    this.setEndOfAnimation = this.setEndOfAnimation.bind(this)
    this.state = new StateSprite(states, this.setEndOfAnimation)
    this.state.set("STAND")
    this.setup()

    this.viewBox = viewBox
    this.map = map
  }

  setup() {
    // this.behavior = new Behavior(constants)
  }

  updateState() {}

  update() {
    super.update()
    this.setPositionFromBehavior()
  }

  setPositionFromBehavior() {
    this.behavior.updateSpeed()
    this.behavior.setCollision(this.map)
    this.position.set(
      this.behavior.getX() - this.viewBox.x,
      this.behavior.getY() - this.viewBox.y,
      this.behavior.getZ(),
    )
  }

  render(program, texture, objet) {
    this.model.translate(
      this.position.getX(),
      this.position.getY(),
      this.position.getZ(),
    )
    program.setTexture(0, texture.get())
    program.setBool("inverseX", this.inverseX ? 1 : 0)
    program.setBool("cornerLeft", this.cornerLeft ? 1 : 0)
    this.setSprite(this.state.get())
    super.render(objet, program)
  }

  setState(state) {
    this.state.set(state)
  }

  setEndOfAnimation() {
    this.behavior.setEndOfAnimation()
  }

  getBehaviorPosition() {
    return this.behavior.getPosition()
  }

  getPosition() {
    return this.position.get()
  }

  getInverseX() {
    return this.inverseX
  }
}
