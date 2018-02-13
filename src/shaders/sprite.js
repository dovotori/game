const vertex = `
attribute vec3 position;
attribute vec2 texture;
uniform mat4 projection;
uniform mat4 model;
uniform mat4 view;
uniform float inverseX;
uniform vec2 spriteUV;
uniform vec2 spriteGrid;
uniform vec2 spriteSize;
varying vec2 fragTexture;

float map(float valeur, float minRef, float maxRef, float minDest, float maxDest) {
  float resultat = minDest + (valeur - minRef) * (maxDest - minDest) / (maxRef - minRef);
  if(resultat > maxDest){ resultat = maxDest; } else if(resultat < minDest){ resultat = minDest; }
  return resultat;
}

void main() {
  vec2 grid =  spriteGrid / spriteSize;
	float texX = map(texture.x, 0.0 + inverseX, 1.0 - inverseX, (spriteUV.x / grid.x), ((spriteUV.x + 1.0) / grid.x) );
	float texY = map(texture.y, 0.0, 1.0, (spriteUV.y / grid.y), ((spriteUV.y + 1.0) / grid.y) );
  fragTexture = vec2(texX, texY);
  gl_Position = projection * view * model * vec4((position.x * spriteSize.x), position.y * spriteSize.y, position.z, 1.0);
}
`

const fragment = `
precision mediump float;
varying vec2 fragTexture;
uniform sampler2D tex0;
void main() {
	gl_FragColor = texture2D(tex0, fragTexture);
}
`

export default {
  vertex,
  fragment,
  attributes: ["position", "texture"],
  uniforms: [
    "projection",
    "model",
    "view",
    "tex0",
    "spriteUV",
    "spriteGrid",
    "spriteSize",
    "inverseX",
  ],
}
