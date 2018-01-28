import PingPongBuffer from "./PingPongBuffer"
import Fbo from "./Fbo"
import Screen from "./Screen"

export default class PostProcess {
  constructor(gl, width = 1024, height = 1024) {
    this.ppb = new PingPongBuffer(gl, width, height)
    this.screen = new Screen(gl)
    this.saveFbo = new Fbo(gl, width, height)

    // this.programTex = new Program()
    // this.fxaa = new Program()
    // this.blurH = new Program()
    // this.blurV = new Program()
    // this.dof = new Program()
    // this.debug = new Program()

    // this.occlusion = new Occlusion()
  }

  setup() {}

  start() {
    this.ppb.begin()
  }
  end() {
    this.ppb.end()
  }

  startSave() {
    this.saveFbo.start()
  }
  endSave() {
    this.saveFbo.end()
  }

  resize(box) {
    this.ppb.resize(box)
  }

  render() {
    this.screen.render(this.ppb.getTexture())
  }

  // setDOF(nearFar, distance) {
  //   if (this.dof.isReady() && this.screen.isReady()) {
  //     this.dof.setBlurTexture(this.ppb.getTexture())
  //     this.ppb.swap()
  //     this.ppb.begin()
  //     this.dof.setDistanceDOF(distance)
  //     this.dof.setNearFar(nearFar)
  //     this.dof.setTexture(this.saveFbo.getTexture())
  //     this.dof.setDepthTexture(this.saveFbo.getDepthTexture())
  //     this.screen.draw(this.dof.get())
  //     this.ppb.end()
  //   }
  // }

  // setFXAA() {
  //   if (this.fxaa.isReady() && this.screen.isReady()) {
  //     this.fxaa.setTexture(this.ppb.getTexture())
  //     this.ppb.swap()
  //     this.ppb.begin()
  //     this.screen.draw(this.fxaa.get())
  //     this.ppb.end()
  //   }
  // }

  // setOcclusion(camera) {
  //   if (this.screen.isReady()) {
  //     this.occlusion.draw(
  //       camera,
  //       this.ppb.getTexture(),
  //       this.ppb.getDepthTexture(),
  //     )
  //     this.ppb.swap()
  //     this.ppb.begin()
  //     this.screen.draw(this.occlusion.getProgram())
  //     this.ppb.end()
  //   }
  // }

  // setBlur(nbPassages, blurDensite) {
  //   if (this.blurV.isReady() && this.blurH.isReady() && this.screen.isReady()) {
  //     this.blurH.setBlur(blurDensite)
  //     this.blurV.setBlur(blurDensite)

  //     for (var i = 0; i < nbPassages; i++) {
  //       this.blurH.setTexture(this.ppb.getTexture())
  //       this.ppb.swap()
  //       this.ppb.begin()
  //       this.screen.draw(this.blurH.get())
  //       this.ppb.end()

  //       this.blurV.setTexture(this.ppb.getTexture())
  //       this.ppb.swap()
  //       this.ppb.begin()
  //       this.screen.draw(this.blurV.get())
  //       this.ppb.end()
  //     }
  //   }
  // }

  // getTexture() {
  //   return this.ppb.getTexture()
  // }

  // setRayonOcclusion(value) {
  //   this.occlusion.setRayon(value)
  // }
}
