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
    position: { x: 10, y: 10, z: 26 },
    target: { x: 10, y: 10, z: 0 },
    near: 1,
    far: 1000,
    angle: 40,
  },
  tilemap: {
    w: 20,
    h: 20,
  },
}
