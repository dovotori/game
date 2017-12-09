export default class PingPongBuffer {
	constructor() {
		this.fbos = [];
		this.currentFbo = 0;
	}

	setup(width, height) {
		this.fbos[0] = new Framebuffer();
		this.fbos[0].setup(width, height);
		this.fbos[1] = new Framebuffer();
		this.fbos[1].setup(width, height);
	}

	begin() {
		this.fbos[this.currentFbo].beginDraw();
	}

	end() {
		this.fbos[this.currentFbo].endDraw();
	}

	swap() {
		if (this.currentFbo < 1) {
			this.currentFbo++;
		} else {
			this.currentFbo = 0;
		}
	}

	getTexture() {
		return this.fbos[this.currentFbo].getTexture();
	}
	getDepthTexture() {
		return this.fbos[this.currentFbo].getDepthTexture();
	}
}
