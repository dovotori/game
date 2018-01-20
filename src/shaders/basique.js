const vertex = `
attribute vec3 position;
void main()
{
  gl_Position = vec4(position, 1.0);
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
  attributes: ["position"],
  uniforms: [],
}

export default basique
