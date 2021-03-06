const vertex = `
attribute vec3 position;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;
uniform mat4 lightview;

varying vec4 fragShadow;

void main() {
	mat4 bias = mat4(
		0.5, 0.0, 0.0, 0.0,
		0.0, 0.5, 0.0, 0.0,
		0.0, 0.0, 0.5, 0.0,
		0.5, 0.5, 0.5, 1.0
	);

	fragShadow = bias * projection * lightview * model * vec4(position, 1.0);
  gl_Position = projection * view * model * vec4(position, 1.0);
}
`

const fragment = `
precision mediump float;

varying vec4 fragShadow;
uniform sampler2D tex0; // depthTex

float  compareShadow(vec2 shad, float compare) {
  float visibilite = 1.0;
  float shadow = texture2D(tex0, shad.xy).x;
  float epsilon = 0.001; //enleve les traits du shadow acne // à regler si l'ombre est trop loin de l'objet

  if(shadow + epsilon < compare) {
    visibilite = 0.4;
  } else {
    visibilite = 1.0;
  }
  return visibilite;
}

float smoothShadow(vec2 shad, float compare, vec2 texelSize) {
  // compare au voisin et on interpole
  vec2 pixelPos = shad / texelSize + vec2(0.5);
  vec2 fractPart = fract(pixelPos);
  vec2 startPixel = (pixelPos - fractPart) * texelSize;

  float blTexel = compareShadow(startPixel, compare);
  float brTexel = compareShadow(startPixel + vec2(texelSize.x, 0.0), compare);
  float tlTexel = compareShadow(startPixel + vec2(0.0, texelSize.y), compare);
  float trTexel = compareShadow(startPixel + texelSize, compare);

  float mixA = mix(blTexel, tlTexel, fractPart.y);
  float mixB = mix(brTexel, trTexel, fractPart.y);

  return mix(mixA, mixB, fractPart.x);
}

float softShadowPCR(vec2 shad, float compare, vec2 texelSize) {
  // on regarde les voisin et on calcule la quantite de lumiere
  float result = 0.0;
  for(float y = -1.0; y <= 1.0; y += 1.0) {
    for(float x = -1.0; x <= 1.0; x += 1.0) {
      vec2 coorOffset = vec2(x, y) * texelSize;
      result += smoothShadow(shad + coorOffset, compare, texelSize);
    }
  }
  return result / 9.0;
}

void main() {
	// ATTENTION NEAR DE LA CAMERA >= 1.0
	float visibilite = 1.0;
	vec4 shad = fragShadow / fragShadow.w;
	vec2 texelSize = vec2(1.0/ 1000.0, 1.0 / 600.0); // taille de la texture

	if (fragShadow.w <= 0.0) {
    // behind light, ignore
		visibilite = 1.0;
	} else if (shad.x < 0.0 || shad.y < 0.0) {
		// outside light frustum, ignore
		visibilite = 1.0;
	} else if (shad.x >= 1.0 || shad.y >= 1.0) {
		// outside light frustum, ignore
		visibilite = 1.0;
	} else {
		visibilite = softShadowPCR(shad.xy, shad.z, texelSize);
	}

	/*///// ADOUCISSEMENT /////////*/
	/*
	vec2 poissonDisk[4];
	poissonDisk[0] = vec2( -0.94201624, -0.39906216 );
	poissonDisk[1] = vec2( 0.94558609, -0.76890725 );
	poissonDisk[2] = vec2( -0.094184101, -0.92938870 );
	poissonDisk[3] = vec2( 0.34495938, 0.29387760 );

	for (int i = 0; i < 4; i++)
	{
		if ( texture2D(tex0, shad.xy + (poissonDisk[i] / 1.0) ).x  <  shad.z)
		{
			visibilite -= 0.1;
		}
	}
	*/

	gl_FragColor = vec4(vec3(1.0, 1.0, 1.0) * visibilite, 1.0);
}


`

export default {
  vertex,
  fragment,
  attributes: ["position"],
  uniforms: ["projection", "model", "view", "lightview", "tex0"],
}
