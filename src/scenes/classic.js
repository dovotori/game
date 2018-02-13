export default {
  assets: [
    "../../../assets/textures/heros.png",
    "../../../assets/textures/tiles.png",
    "../../../assets/objets/tile.obj",
    "../../../assets/objets/cube.obj",
    "../../../assets/levels/level.bmp",
  ],
  programs: ["color", "sprite"],
  camera: {
    position: { x: 0, y: 0, z: 20 },
    near: 1,
    far: 1000,
    angle: 50,
  },
}
