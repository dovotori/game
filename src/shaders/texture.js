const vertex = `
attribute vec3 position;
attribute vec2 texture;
uniform mat4 projection;
uniform mat4 model;
uniform mat4 view;
varying vec2 fragTexture;
void main()
{
  fragTexture = texture;
  gl_Position = projection * view * model * vec4(position, 1.0);
}
`

const fragment = `
precision mediump float;
varying vec2 fragTexture;
uniform sampler2D tex0;
void main()
{
	gl_FragColor = texture2D(tex0, fragTexture);
}
`

const texture = {
  vertex,
  fragment,
  attributes: ["position", "texture"],
  uniforms: ["projection", "model", "view"],
}

export default texture
