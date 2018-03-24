const vertex = `
attribute vec3 position;
attribute vec2 texture;
varying vec2 fragTexture;
void main() {
  fragTexture = texture;
  gl_Position = vec4(position, 1.0);
}
`

const fragment = `
precision mediump float;
varying vec2 fragTexture;
uniform sampler2D tex0;
uniform float time;
uniform float radius;
uniform vec2 center; // coor texture 0 à 1

void main() {
	float w = center.x - (fragTexture.x);
  float h = center.y - fragTexture.y;
	float distanceFromCenter = sqrt(w * w + h * h);
	float sinArg = distanceFromCenter * 1.0 - time * 1.0;
  float slope = cos(sinArg);
  float wave = slope * radius;
  vec2 uv = fragTexture + normalize(vec2(w, h)) * wave;
	vec4 color = texture2D(tex0, uv);
	gl_FragColor = color;
}
`

export default {
  vertex,
  fragment,
  attributes: ["position", "texture"],
  uniforms: ["tex0", "time", "radius", "center"],
}
