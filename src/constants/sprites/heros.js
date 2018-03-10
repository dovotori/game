export default {
  grid: { w: 8, h: 8 },
  time: 100,
  STAND: {
    uv: [{ x: 0, y: 0 }, { x: 1, y: 0 }],
    time: 1000,
  },
  RUN: {
    uv: [{ x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }],
  },
  DASH: {
    uv: [{ x: 0, y: 2, w: 2 }, { x: 1, y: 2, w: 2 }],
    iteration: 1,
    next: "STAND",
  },
  JUMP_UP: {
    uv: [{ x: 0, y: 1 }, { x: 1, y: 1 }],
  },
  JUMP_DOWN: {
    uv: [{ x: 2, y: 1 }, { x: 3, y: 1 }],
  },
  RUN_JUMP_UP: {
    uv: [{ x: 4, y: 1 }, { x: 5, y: 1 }],
  },
  RUN_JUMP_DOWN: {
    uv: [{ x: 6, y: 1 }, { x: 7, y: 1 }],
  },
  AIM: {
    uv: [{ x: 6, y: 0 }],
  },
  DIE: {
    uv: [{ x: 4, y: 2 }, { x: 2.5, y: 2, w: 2 }],
    time: 1000,
    iteration: 1,
  },
  SLASH: {
    uv: [
      { x: 0, y: 2, w: 2, h: 2 },
      { x: 1, y: 2, w: 2, h: 2 },
      { x: 2, y: 2, w: 2, h: 2 },
    ],
    iteration: 1,
    next: "STAND",
  },
  BULLET: {
    uv: [{ x: 6, y: 3 }, { x: 7, y: 3 }],
  },
  BULLET_LOAD: {
    uv: [{ x: 6, y: 4 }, { x: 7, y: 4 }],
  },
}
