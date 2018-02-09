export default class {
  constructor(states) {
    this.states = states
  }

  render(state) {
    console.log(this.states[state])
  }
}
