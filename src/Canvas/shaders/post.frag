precision mediump float;
varying vec2 vUv;
uniform sampler2D uTex;
uniform float uTime;

float rnd(vec2 n) {
  return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

void main() {
  // float n = rnd(gl_FragCoord.st + mod(uTime, 10.0)) * 0.5 + 0.7;
  vec2 uv = vUv;
  float n = 150.0;
  uv = uv * n;
  uv.x = floor(uv.x) + 0.5;
  uv.y = floor(uv.y) + 0.5;
  uv = uv / n;
  vec4 texColor = texture2D(uTex, uv);
  gl_FragColor = texColor;
}
