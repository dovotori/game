import Vec3 from "../geometrie/Vec3"

export default class {
  constructor() {
    this.position = new Vec3(0, 0, 0.1)
    this.vitesse = new Vec3(0, 0, 0)
  }

  render() {
    this.position.plus(this.vitesse)
    this.vitesse.multiplierValeur(0.7)
  }

  getPosition() {
    return this.position.get()
  }

  setInteraction(interaction) {
    let add = new Vec3(0, 0, 0)
    if (interaction.LEFT && interaction.RIGHT) {
      add.set(0, 0, 0)
    } else if (interaction.RIGHT) {
      add.set(0.1, 0, 0)
    } else if (interaction.LEFT) {
      add.set(-0.1, 0, 0)
    } else {
      add.set(0, 0, 0)
    }
    this.vitesse.plus(add)
  }
}
