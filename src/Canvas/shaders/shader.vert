varying vec3 vNormal;

void main() {
  vNormal = normalMatrix * normal;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
