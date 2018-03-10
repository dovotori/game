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
    this.collision.addBoxes(this.boxes)
  }

  afterStart() {
    super.afterStart()
    const herosPos = this.heros.getBehaviorPosition()
    const monsterPos = this.monster.getBehaviorPosition()
    this.boxes[0].update(herosPos[0], herosPos[1], herosPos[2], 1, 1, 1)
    this.boxes[1].update(monsterPos[0], monsterPos[1], monsterPos[2], 1, 1, 1)
    console.log(this.collision.getPaires())
  }
}
