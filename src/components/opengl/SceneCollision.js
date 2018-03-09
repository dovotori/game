import SceneGame from "./SceneGame"
import CollisionSweepPrune from "../geometrie/CollisionSweepPrune"
import CollisionBox from "../geometrie/CollisionBox"

export default class extends SceneGame {
  constructor(gl, scene, callbackLoaded = null) {
    super(gl, scene, callbackLoaded)

    this.collision = new CollisionSweepPrune()
    this.boxes = []
    this.boxes[0] = new CollisionBox()
    this.boxes[1] = new CollisionBox()
    this.boxes[0].setup("heros")
    this.boxes[1].setup("monster")
    this.boxes[0].update(0.1, 0, 0, 1, 1, 1)
    this.boxes[1].update(0, 0, 0, 1, 1, 1)
    this.collision.addBoxes(this.boxes)
    this.collision.update(this.boxes)

    this.cpt = -4
    this.direction = 1
  }

  update() {
    super.update()
    if (this.cpt > 4 || this.cpt < -4) {
      this.direction *= -1
    }
    this.cpt += this.direction * 0.01
    this.boxes[0].update(this.cpt, 0, 0, 1, 1, 1)
    // console.log(this.cpt)
    // this.collision.update(this.boxes)
  }
}
