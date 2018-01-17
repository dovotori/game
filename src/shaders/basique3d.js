const vertex = `
attribute vec3 Position;
uniform mat4 projection;
uniform mat4 model;
uniform mat4 view;
void main()
{
  gl_Position = projection * view * model * vec4(Position, 1.0);
}
`

const fragment = `
precision mediump float;
void main()
{
  gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}
`

const basique3d = {
  vertex,
  fragment,
  attributes: ["Position"],
  uniforms: ["projection", "model", "view"],
}

export default basique3d
