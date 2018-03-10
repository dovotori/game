const vertex = `
attribute vec3 position;
attribute vec3 normale;
uniform mat4 projection;
uniform mat4 model;
uniform mat4 view;
uniform mat3 normalmatrix;
varying vec3 fragPosition;
varying vec3 fragNormale;
void main()
{
  fragPosition = normalize((view * model * vec4(position, 1.0)).xyz);
  fragNormale = normalmatrix * normalize(normale);
  gl_Position = projection * view * model * vec4(position, 1.0);
}
`

const fragment = `
precision mediump float;
varying vec3 fragPosition;
varying vec3 fragNormale;

uniform vec3 ambiant;
uniform vec3 diffuse;
uniform vec3 specular;
uniform float brillance; // de 0 à infini
uniform vec3 posLum;
uniform vec3 posEye;

void main() {
  vec3 N = normalize(fragNormale);
  vec3 L = normalize(posLum - fragPosition);

  // Lambert's cosine law
  float lambertian = max(dot(N, L), 0.0);

  float specularValue = 0.0;
  if(lambertian > 0.0) {
    vec3 R = reflect(-L, N); // Reflected light vector
    vec3 V = normalize(-fragPosition); // Vector to viewer
    float specAngle = max(dot(R, V), 0.0);
    specularValue = pow(specAngle, brillance);
  }
  gl_FragColor = vec4(ambiant + (lambertian * diffuse) + (specularValue * specular), 1.0);
}
`

export default {
  vertex,
  fragment,
  attributes: ["position", "normale"],
  uniforms: [
    "projection",
    "model",
    "view",
    "normalmatrix",
    "ambiant",
    "diffuse",
    "specular",
    "brillance",
    "posLum",
    "posEye",
  ],
}
