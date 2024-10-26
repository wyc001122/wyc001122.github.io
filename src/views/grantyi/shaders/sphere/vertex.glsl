#include "../includes/simplexNoise3d.glsl"
#include "../includes/hsv2rgb.glsl"

uniform vec2 uResolution;
uniform float uSize;
uniform float uTime;

varying vec3 vColor;
varying vec3 vNormal;
varying vec2 vUv;

void main() {
    float nosie = simplexNoise3d(position * 8.0 + uTime / 8.);
    vec3 newPosition = position * (nosie + .5);

    vColor = hsv2rgb(vec3(nosie * .1 + 0.03, 0.8, 0.8));
    vNormal = normal;
    vUv = uv;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}