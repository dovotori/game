const vertex = `
attribute vec3 position;
uniform mat4 projection;
uniform mat4 model;
uniform mat4 view;
uniform vec4 color;
varying vec4 fragColor;

void main() {
  fragColor = color;
  gl_Position = projection * view * model * vec4(position, 1.0);
}
`

const fragment = `
precision mediump float;
varying vec4 fragColor;

void main() {
  gl_FragColor = fragColor;
}
`

export default {
  vertex,
  fragment,
  attributes: ["position"],
  uniforms: ["projection", "model", "view", "color"],
}
