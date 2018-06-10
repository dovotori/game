export default {
  assets: [
    "/assets/textures/heros.png",
    "/assets/textures/tiles.png",
    "/assets/objets/tile.obj",
    "/assets/objets/cube.obj",
    "/assets/objets/cubeTile.obj",
    "/assets/levels/level1.bmp",
  ],
  programs: ["color", "sprite", "spritePhong"],
  camera: {
    position: { x: 10, y: 10, z: 40 },
    target: { x: 10, y: 10, z: 0 },
    near: 1,
    far: 1000,
    angle: 40,
  },
  lampe: {
    position: { x: 0, y: 0, z: 10 },
  },
  tilemap: {
    w: 20,
    h: 20,
  },
  keyboard: {
    38: "UP",
    40: "DOWN",
    37: "LEFT",
    39: "RIGHT",
    32: "SPACE",
    16: "SHIFT",
    88: "X",
    87: "W",
    13: "ENTER",
    27: "ECHAP",
  },
  splashscreen: false,
}
