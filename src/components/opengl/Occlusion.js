export default class Occlusion {
  constructor() {
    this.textureNoise = new Texture();
    this.programOcclusion = new Program();
    this.samples = null;
    this.rayon = 60.0;
    this.kernelSize = 32;
  }

  setup(path) {
    this.programOcclusion.setup(path + 'shader/occlusion');
    this.textureNoise.setupOcclusionNoise(64);
    this.samples = new Array(this.kernelSize * 3);
    this.randomSamples();
  }

  draw(camera, colormap, depthmap) {
    if (this.textureNoise.isReady() && this.programOcclusion.isReady()) {
      this.programOcclusion.setMatrices(
        camera.getProjection().transpose(),
        camera.getView().transpose(),
        camera.getMatriceIdentity().transpose(),
        null,
      );

      this.programOcclusion.setTexture(colormap);
      this.programOcclusion.setDepthTexture(depthmap);
      this.programOcclusion.setNoiseTexture(this.textureNoise.get());

      this.programOcclusion.setOcclusion(this.samples, this.kernelSize, this.rayon);

      var inverseProjection = new Mat4();
      inverseProjection.egale(camera.getProjection());
      inverseProjection.inverser();
      this.programOcclusion.setInverseProjection(inverseProjection.transpose());
    }
  }

  randomSamples() {
    var tmpSamples = [this.kernelSize];

    for (var i = 0; i < this.kernelSize; i++) {
      tmpSamples[i] = new Vec3(random(-1.0, 1.0), random(-1.0, 1.0), random(0.0, 1.0));
      tmpSamples[i].normaliser();
      tmpSamples[i] = tmpSamples[i].multiplierValeur(random(0.0, 1.0));

      var scale = i / this.kernelSize;
      scale = lerp(scale * scale, 0.1, 1.0);
      tmpSamples[i] = tmpSamples[i].multiplierValeur(scale);
    }
    var cpt = 0;
    for (var i = 0; i < this.kernelSize; i++ , cpt += 3) {
      this.samples[cpt] = tmpSamples[i].x;
      this.samples[cpt + 1] = tmpSamples[i].y;
      this.samples[cpt + 2] = tmpSamples[i].z;
    }
  }

  getProgram() {
    return this.programOcclusion.get();
  }

  setRayon(value) {
    this.rayon = value;
  }
}
