#include "../includes/simplexNoise3d.glsl"
#include "../includes/hsv2rgb.glsl"

uniform float uTime;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

void main() {

    vec3 p = position;

    p.y += 0.2 * (sin(p.y * 5. + uTime * 5.) * 0.5 + 0.5);
    p.z += 0.05 * (sin(p.y * 15. + uTime * 5.) * 0.5 + 0.5);

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);

    gl_PointSize = 10.0 * (1. / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;

    vUv = uv;
    vPosition = position;
    vNormal = normal;
}