const vertex = `
attribute vec3 Position;
attribute vec2 Texture;
uniform mat4 projection;
uniform mat4 model;
uniform mat4 view;
varying vec2 fragTexture;
void main()
{
  fragTexture = Texture;
  gl_Position = projection * view * model * vec4(Position, 1.0);
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
  attributes: ["Position", "Texture"],
  uniforms: ["projection", "model", "view"],
}

export default texture
