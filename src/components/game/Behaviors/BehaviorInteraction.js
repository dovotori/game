import BehaviorGravity from "./BehaviorGravity"

export default class extends BehaviorGravity {
  constructor(constants, callbackState) {
    super(constants)
    this.callbackState = callbackState
    this.isAnimating = false
    this.isBlocking = false
    this.oldX = false
    this.oldShift = false
    this.isDashing = false
  }

  setInteraction(interaction, changed) {
    this.isDashing = false
    if (!this.isAnimating && !this.isBlocking) {
      this.cornerLeft = true

      if (interaction.UP) {
        this.speed.addY(this.constants.run)
      }
      if (interaction.DOWN) {
        this.speed.addY(-this.constants.run)
      }
      if (interaction.RIGHT) {
        this.speed.addX(
          this.isCollision.landing
            ? this.constants.run
            : this.constants.aircontrol,
        )
        this.inverseSprite = false
      }
      if (interaction.LEFT) {
        this.speed.addX(
          this.isCollision.landing
            ? -this.constants.run
            : -this.constants.aircontrol,
        )
        this.inverseSprite = true
      }

      if (this.isCollision.landing) {
        if (interaction.RIGHT || interaction.LEFT) {
          this.statusSprite = "RUN"
        } else {
          this.statusSprite = "STAND"
        }
        if (interaction.X && !this.oldX) {
          this.statusSprite = "SLASH"
        }
        if (interaction.SPACE) {
          this.speed.setY(this.constants.jump)
        }
        if (interaction.SHIFT && !this.oldShift) {
          this.speed.setX(
            this.inverseSprite ? -this.constants.dash : this.constants.dash,
          )
          this.statusSprite = "DASH"
          this.cornerLeft = false
          this.isDashing = true
        }
        if (interaction.W) {
          this.statusSprite = "AIM"
          this.isBlocking = true
        }
      }
    }

    if (changed) {
      this.oldX = interaction.X
      this.oldShift = interaction.SHIFT
      if (!this.isAnimating) {
        this.callbackState(
          this.statusSprite,
          this.inverseSprite,
          this.cornerLeft,
        )
        if (this.statusSprite === "SLASH" || this.statusSprite === "DASH") {
          this.isAnimating = true
        }
      }
      if (!interaction.W) {
        this.isBlocking = false
      }
    } else {
      if (!this.isAnimating && !this.isBlocking) {
        if (!this.isCollision.landing) {
          if (Math.abs(this.speed.getX()) > 0) {
            this.statusSprite =
              this.speed.getY() > 0 ? "RUN_JUMP_UP" : "RUN_JUMP_DOWN"
          } else {
            this.statusSprite = this.speed.getY() > 0 ? "JUMP_UP" : "JUMP_DOWN"
          }
        }
        this.callbackState(
          this.statusSprite,
          this.inverseSprite,
          this.cornerLeft,
        )
      }
    }
  }

  setEndOfAnimation() {
    this.isAnimating = false
  }

  getAiming() {
    return this.isBlocking
  }

  getDashing() {
    return this.isDashing
  }
}
