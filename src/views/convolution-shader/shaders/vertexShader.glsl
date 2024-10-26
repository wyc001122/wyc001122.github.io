uniform vec2 u_Resolution;
varying vec2 vUv;
varying vec2 v_uv0;
varying vec2 v_uv1;
varying vec2 v_uv2;
varying vec2 v_uv3;
varying vec2 v_uv4;
varying vec2 v_uv5;
varying vec2 v_uv6;
varying vec2 v_uv7;
varying vec2 v_uv8;
void main() {
    vUv = uv;
    vec2 texelSize = 1.0 / u_Resolution;
    v_uv0 = vUv + texelSize * vec2(-1.0, 1.0);
    v_uv1 = vUv + texelSize * vec2(0.0, 1.0);
    v_uv2 = vUv + texelSize * vec2(1.0, 1.0);
    v_uv3 = vUv + texelSize * vec2(-1.0, 0.0);
    v_uv4 = vUv + texelSize * vec2(0.0, 0.0);
    v_uv5 = vUv + texelSize * vec2(1.0, 0.0);
    v_uv6 = vUv + texelSize * vec2(-1.0, -1.0);
    v_uv7 = vUv + texelSize * vec2(0.0, -1.0);
    v_uv8 = vUv + texelSize * vec2(1.0, -1.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}