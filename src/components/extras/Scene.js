export default class Scene {
  constructor() {
    this.canvas2d;
    this.canvas3d;
    this.debug;
    this.lastFrame;
    this.fps = 1000 / 50;
    this.mode;
    this.width;
    this.height;
    this.clearColor = [50.0, 50.0, 180.0, 1.0];
    this.alert;
    this.refresh = 'all'; // all // no // depth // color
  }

  setup(mode) {
    this.mode = mode;

    this.alert = document.getElementById('no-webgl');
    this.debug = document.getElementById('debug');
    this.canvas2d = document.getElementById('canvas2d');
    this.canvas3d = document.getElementById('canvas3d');

    if (this.mode == 'both') {
      this.setup2D();
      this.setup3D();
    } else if (this.mode == '3d') {
      this.setup3D();
      this.disable2D();
    } else {
      this.disable3D();
      this.setup2D();
    }

    this.width = parseInt(canvas3d.getAttribute('width'));
    this.height = parseInt(canvas3d.getAttribute('height'));

    this.lastFrame = new Date().getTime();

    this.activeFullscreen();
  }

  activeFullscreen() {
    var btn = document.getElementById('goFullscreen');
    if (btn) {
      btn.addEventListener('click', this.toggleFullscreen.bind(this), false);
    }
  }
  toggleFullscreen(event) {
    var elem = document.getElementsByClassName('dessin')[0];
    toggleFullscreen(elem);
  }

  setup2D() {
    try {
      context = this.canvas2d.getContext('2d');
      this.alert.style.display = 'none';
    } catch (err) {
      console.log('Erreur lors du chagement du contexte 2d');
    }
  }

  disable2D() {
    if (this.canvas2d != null) {
      this.canvas2d.style.display = 'none';
    }
  }

  setup3D() {
    try {
      var options = null;
      if (this.refresh == 'no') {
        options = { preserveDrawingBuffer: true };
      }

      gl = this.canvas3d.getContext('webgl', options);
    } catch (err) {
      console.log('Navigateur ne supporte pas WebGL');
      this.disable3D();
    }
  }

  disable3D() {
    if (this.alert) {
      this.alert.style.display = 'block';
      this.setAlert('Pas de webgl', 'Votre navigateur ne supporte pas webGL.');
    }
    if (this.canvas3d != null) {
      this.canvas3d.style.display = 'none';
    }
  }

  resize() {
    if (isFullscreen()) {
      this.resizeFullscreen();
    } else {
      var canvas = this.canvas2d;
      if (this.mode == 'both' || this.mode == '3d') {
        canvas = this.canvas3d;
      }

      var canvasWidth = parseInt(canvas.getAttribute('width'));
      var canvasHeight = parseInt(canvas.getAttribute('height'));

      var scale = document.body.clientWidth / canvasWidth;
      var w = Math.floor(scale * canvasWidth);
      var h = Math.floor(scale * canvasHeight);

      canvas.style.maxWidth = '1400px';
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';

      this.width = w;
      this.height = h;
    }
  }

  resizeFullscreen() {
    var canvas = this.canvas2d;
    if (this.mode == 'both' || this.mode == '3d') {
      canvas = this.canvas3d;
    }
    var w = document.body.clientWidth;
    var h = window.innerHeight;

    canvas.style.maxWidth = '100%';
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';

    this.width = w;
    this.height = h;
  }

  draw(dessin) {
    try {
      var now = new Date().getTime();
      var milli = now - this.lastFrame;

      if (milli > this.fps) {
        this.setRefresh();

        dessin.update();
        dessin.draw();

        this.lastFrame = now;
      }
    } catch (e) {
      console.log('Error: ' + e);
    }
  }

  setRefresh() {
    if (this.mode == 'both') {
      this.clearContext3d();
      this.setTypeRefresh3D();
      this.clearContext2d();
    } else if (this.mode == '3d') {
      this.clearContext3d();
      this.setTypeRefresh3D();
    } else {
      this.clearContext2d();
    }
  }

  setTypeRefresh3D() {
    switch (this.refresh) {
      case 'all':
      default:
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        break;
      case 'depth':
        gl.clear(gl.DEPTH_BUFFER_BIT);
        break;
      case 'color':
        gl.clear(gl.COLOR_BUFFER_BIT);
        break;
      case 'no':
        break;
    }
  }

  setAlert(titre, texte) {
    this.alert.firstChild.innerHTML = titre;
    this.alert.getElementsByTagName('p')[0].innerHTML = texte;
  }
  isReady() {
    this.alert.style.display = 'none';
  }

  /////////////////////// 2D ////////////////////////
  clearContext2d() {
    context.clearRect(0, 0, this.canvas2d.width, this.canvas2d.height);
  }

  /////////////////////// 3D ////////////////////////
  clearContext3d() {
    gl.clearColor(
      this.clearColor[0] / 255.0,
      this.clearColor[1] / 255.0,
      this.clearColor[2] / 255.0,
      this.clearColor[3],
    );
  }

  enableDepth() {
    if (gl != null) {
      gl.clearDepth(1.0);
      gl.enable(gl.DEPTH_TEST);
    }
  }

  enableDepthTexture() {
    // get depth extension
    var test = gl.getExtension('WEBGL_depth_texture');
    if (!test) {
      console.log('pas de support depth frame buffer');
    }
  }

  enableBlend() {
    if (gl != null) {
      // alpha pour les textures
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    }
  }

  enablePointerLock() {
    var elem = document.getElementsByClassName('dessin')[0];
    elem.requestPointerLock =
      elem.requestPointerLock || elem.mozRequestPointerLock || elem.webkitRequestPointerLock;

    document.exitPointerLock =
      document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock;

    elem.addEventListener(
      'click',
      function() {
        this.requestPointerLock();
      },
      false,
    );
  }

  disableKeyboardScroll() {
    window.addEventListener(
      'keydown',
      function(e) {
        if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
          e.preventDefault();
        }
      },
      false,
    );
  }

  setClearColor(r, v, b, a) {
    this.clearColor = [r, v, b, a];
  }
  setFPS(value) {
    this.fps = value;
  }
  setTypeRefresh(value) {
    this.refresh = value;
  }
}
