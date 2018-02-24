const vertex = `
attribute vec3 position;
attribute vec2 texture;
uniform mat4 projection;
uniform mat4 model;
uniform mat4 view;
uniform int inverseX;
uniform int cornerLeft;
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
	float texX = map(texture.x, 0.0 + float(inverseX), 1.0 - float(inverseX), (spriteUV.x / grid.x), ((spriteUV.x + 1.0) / grid.x) );
	float texY = map(texture.y, 1.0, 0.0, (spriteUV.y / grid.y), ((spriteUV.y + 1.0) / grid.y) );
  fragTexture = vec2(texX, texY);

  float posWithSizeX;
  if (inverseX ==  1) {
    if (cornerLeft == 1) {
      posWithSizeX = (position.x * spriteSize.x) + (1.0 - spriteSize.x);
    } else {
      posWithSizeX = position.x * spriteSize.x;
    }
  } else {
    if (cornerLeft == 1) {
      posWithSizeX = position.x * spriteSize.x;
    } else {
      posWithSizeX = (position.x * spriteSize.x) + (1.0 - spriteSize.x);
    }
  }
  float posWithSizeY = (position.y * spriteSize.y) - (1.0 - spriteSize.y);
  gl_Position = projection * view * model * vec4(posWithSizeX, posWithSizeY, position.z, 1.0);
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
    "cornerLeft",
  ],
}
