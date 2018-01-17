const vertex = `
attribute vec3 Position;
void main()
{
  gl_Position = vec4(Position, 1.0);
}
`

const fragment = `
precision mediump float;
void main()
{
  gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}
`

const basique = {
  vertex,
  fragment,
  attributes: ["Position"],
  uniforms: [],
}

export default basique
