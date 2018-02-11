export default class {
  constructor(source) {
    this.addFaceIndex = this.addFaceIndex.bind(this)
    this.obj = {
      v: {
        indices: [],
        points: [],
      },
      vt: {
        indices: [],
        points: [],
      },
      vn: {
        indices: [],
        points: [],
      },
    }
    this.setup(source)
  }

  setup(source) {
    const lines = source.split("\n")
    lines.forEach(line => {
      const words = line.split(" ")
      const firstWord = words[0]
      switch (firstWord) {
        case "f":
          this.addFace(words.slice(1))
          break
        case "v":
        case "vn":
        case "vt":
          this.addPoints(firstWord, words.slice(1))
          break
        default:
          break
      }
    })
  }

  addFace(words) {
    words.forEach(this.addFaceIndex)
  }

  addFaceIndex(indexGroup) {
    const indexes = indexGroup.split("/")
    if (indexes[0] && indexes[0] !== "") {
      this.obj.v.indices.push(parseInt(indexes[0]) - 1)
    }
    if (indexes[1] && indexes[1] !== "") {
      this.obj.vt.indices.push(parseInt(indexes[1]) - 1)
    }
    if (indexes[2] && indexes[2] !== "") {
      this.obj.vn.indices.push(parseInt(indexes[2]) - 1)
    }
  }

  addPoints(type, coor) {
    let finalCoor = type === "vt" && coor.length === 3 ? coor.slice(0, 2) : coor
    // if (type === "vt") console.log(finalCoor)
    finalCoor.forEach(c => this.obj[type].points.push(parseFloat(c, 10)))
  }

  get() {
    return this.obj
  }

  getSteps() {
    const step = { position: 3, texture: null, normale: null }
    if (this.obj.vt.indices.length > 0) {
      step.texture = 2
    }
    if (this.obj.vn.indices.length > 0) {
      step.normale = 3
    }
    return step
  }

  getAllInOne() {
    const finalPoints = []

    this.obj.v.indices.forEach((indice, idx) => {
      const vIdx = indice * 3
      finalPoints.push(this.obj.v.points[vIdx])
      finalPoints.push(this.obj.v.points[vIdx + 1])
      finalPoints.push(this.obj.v.points[vIdx + 2])

      if (this.obj.vt.indices.length > 0) {
        const vtIdx = this.obj.vt.indices[idx] * 2
        finalPoints.push(this.obj.vt.points[vtIdx])
        finalPoints.push(this.obj.vt.points[vtIdx + 1])
      }

      if (this.obj.vn.indices.length > 0) {
        const vnIdx = this.obj.vn.indices[idx] * 3
        finalPoints.push(this.obj.vn.points[vnIdx])
        finalPoints.push(this.obj.vn.points[vnIdx + 1])
        finalPoints.push(this.obj.vn.points[vnIdx + 2])
      }
    })

    return {
      points: finalPoints,
      steps: this.getSteps(),
    }
  }
}
