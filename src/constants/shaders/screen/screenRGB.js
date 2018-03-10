const vertex = `
attribute vec3 position;
attribute vec2 texture;
varying vec2 fragTexture;
void main()
{
  fragTexture = texture;
  gl_Position = vec4(position, 1.0);
}
`

const fragment = `
precision mediump float;
varying vec2 fragTexture;
uniform sampler2D tex0;
uniform vec2 delta;
void main() {
  vec2 resolution = vec2(1.0);

  vec2 dir = fragTexture - vec2( .5 );
  vec2 value = dir * delta;

	vec4 c1 = texture2D( tex0, fragTexture - value / resolution.x );
	vec4 c2 = texture2D( tex0, fragTexture );
	vec4 c3 = texture2D( tex0, fragTexture + value / resolution.y );

  gl_FragColor = vec4( c1.r, c2.g, c3.b, c1.a + c2.a + c3.b );
}
`

export default {
  vertex,
  fragment,
  attributes: ["position", "texture"],
  uniforms: ["tex0", "delta"],
}
