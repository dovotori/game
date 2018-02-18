export default class {
  constructor(states) {
    this.states = states
    this.step = 0
    this.nbSteps = 1
    this.timeout = this.states.time
    this.lastFrame = null
    this.sprite = {
      uv: { x: 0, y: 0, w: 1, h: 1 },
      size: { w: 1, h: 1 },
    }
    this.uv = null
    this.iteration = null
    this.nextState = null
    this.currentState = null
  }

  set(state) {
    if (this.currentState !== state) {
      const data = this.states[state]
      this.uv = data.uv
      this.setUV(0)

      this.nbSteps = this.uv.length
      if (this.nbSteps === 1) {
        this.lastFrame = null
      } else {
        this.timeout = data.time || this.states.time
        this.step = 0
        this.iteration = data.iteration || null
        this.nextState = data.next || null
        this.lastFrame = new Date().getTime()
      }
    }
    this.currentState = state
  }

  get() {
    if (this.lastFrame !== null) {
      let now = new Date().getTime()
      let milli = now - this.lastFrame
      if (milli > this.timeout) {
        this.step < this.nbSteps - 1 ? this.nexStep() : this.endOfLoop()
        this.setUV(this.step)
        this.lastFrame = now
      }
    }
    return [
      this.sprite.uv.x,
      this.sprite.uv.y,
      this.states.grid.w,
      this.states.grid.h,
      this.sprite.uv.w,
      this.sprite.uv.h,
    ]
  }

  setUV(step) {
    this.sprite.uv = {
      x: this.uv[step].x || 0,
      y: this.uv[step].y || 0,
      w: this.uv[step].w || 1,
      h: this.uv[step].h || 1,
    }
  }

  nexStep() {
    this.step++
  }

  endOfLoop() {
    if (this.iteration === 1) {
      if (this.nextState !== null) {
        this.set(this.nextState)
      } else {
        this.lastFrame = null
      }
    } else {
      this.step = 0
    }
  }

  getName() {
    return this.currentState
  }
}
