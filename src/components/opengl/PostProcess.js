import PingPongBuffer from "./PingPongBuffer"
import Fbo from "./Fbo"
import Screen from "./Screen"
import Program from "./Program"
import * as glsl from "../../constants/shaders/screen"

export default class {
  constructor(gl, width = 1024, height = 1024) {
    this.gl = gl
    this.ppb = new PingPongBuffer(this.gl, width, height)
    this.screen = new Screen(this.gl)
    this.saveFbo = new Fbo(this.gl, width, height)

    this.finalRender = new Program(this.gl, glsl.screen)
    this.fxaa = new Program(this.gl, glsl.fxaa)
    this.rgb = new Program(this.gl, glsl.rgb)
    // this.programTex = new Program()
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
    this.finalRender.setTexture(0, this.ppb.getTexture().get())
    this.screen.render(this.finalRender.get())
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

  setFXAA() {
    this.fxaa.setTexture(0, this.ppb.getTexture().get())
    this.ppb.swap()
    this.ppb.begin()
    this.screen.render(this.fxaa.get())
    this.ppb.end()
  }

  setRGB(deltaX, deltaY) {
    this.fxaa.setTexture(0, this.ppb.getTexture().get())
    this.ppb.swap()
    this.ppb.begin()
    this.rgb.setVector("delta", [deltaX, deltaY])
    this.screen.render(this.rgb.get())
    this.ppb.end()
  }

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
