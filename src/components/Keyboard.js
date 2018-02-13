export default class {
  constructor() {
    // code ascii 127
    // a = 65
    this.touches = new Array(127)
    this.oldFocusKey = 0
    this.isChangedKey = false

    this.eventClavier = this.eventClavier.bind(this)

    this.setup()
  }

  setup() {
    for (let i = 0; i < this.touches.length; i++) {
      this.touches[i] = false
    }

    document.addEventListener("keydown", this.eventClavier, false)
    document.addEventListener("keyup", this.eventClavier, false)
  }

  render() {
    this.isChangedKey = false
  }

  eventClavier(e) {
    if (e.type == "keydown") {
      if (e.keyCode != this.oldFocusKey) {
        this.oldFocusKey = e.keyCode
        this.isChangedKey = true
      }
    } else if (e.type == "keyup") {
      this.oldFocusKey = -1
      this.isChangedKey = true
    }

    if (this.isChangedKey) {
      if (e.type == "keydown") {
        this.touches[e.keyCode] = true
      } else if (e.type == "keyup") {
        this.touches[e.keyCode] = false
      }
    }
  }

  getKey(code) {
    return this.touches[code]
  }
  setKey(code) {
    this.touches[code] = false
  }
  hasChanged() {
    return this.isChangedKey
  }
}
