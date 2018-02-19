import Behavior from "./Behavior"

export default class extends Behavior {
  setInteraction(interaction) {
    if (interaction.UP) {
      this.speed.addY(this.constants.run)
    }
    if (interaction.DOWN) {
      this.speed.addY(-this.constants.run)
    }
    if (interaction.RIGHT) {
      this.speed.addX(this.constants.run)
      this.inverseSprite = false
    }
    if (interaction.LEFT) {
      this.speed.addX(-this.constants.run)
      this.inverseSprite = true
    }
    if (this.isLanding && interaction.SPACE) {
      this.speed.setY(this.constants.jump)
    }

    if (this.isLanding) {
      if (interaction.RIGHT || interaction.LEFT) {
        this.statusSprite = "RUN"
      } else {
        this.statusSprite = "STAND"
      }
      if (interaction.X) {
        this.statusSprite = "SLASH"
      }
    }
  }

  getState() {
    if (!this.isLanding) {
      if (Math.abs(this.speed.getX()) > 0) {
        this.statusSprite =
          this.speed.getY() > 0 ? "RUN_JUMP_UP" : "RUN_JUMP_DOWN"
      } else {
        this.statusSprite = this.speed.getY() > 0 ? "JUMP_UP" : "JUMP_DOWN"
      }
    }

    return {
      inverse: this.inverseSprite,
      name: this.statusSprite,
    }
  }
}
