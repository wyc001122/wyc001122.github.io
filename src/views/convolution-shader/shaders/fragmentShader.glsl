#include <common>
uniform vec3 lineColor;
uniform float lineOpacity;
uniform bool showLine;
uniform sampler2D tDiffuse;
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
float sobel() {
    float Gx[9];
    Gx[0] = -1.0;
    Gx[1] = -2.0;
    Gx[2] = -1.0;
    Gx[3] = 0.0;
    Gx[4] = 0.0;
    Gx[5] = 0.0;
    Gx[6] = 1.0;
    Gx[7] = 2.0;
    Gx[8] = 1.0;

    float Gy[9];
    Gy[0] = -1.0;
    Gy[1] = 0.0;
    Gy[2] = 1.0;
    Gy[3] = -2.0;
    Gy[4] = 0.0;
    Gy[5] = 2.0;
    Gy[6] = -1.0;
    Gy[7] = 0.0;
    Gy[8] = 1.0;

    float texColor = 0.0;
    float edgeX = 0.0;
    float edgeY = 0.0;

    texColor = luminance(texture2D(tDiffuse, v_uv0).rgb);
    edgeX += texColor * Gx[0];
    edgeY += texColor * Gy[0];
    texColor = luminance(texture2D(tDiffuse, v_uv1).rgb);
    edgeX += texColor * Gx[1];
    edgeY += texColor * Gy[1];
    texColor = luminance(texture2D(tDiffuse, v_uv2).rgb);
    edgeX += texColor * Gx[2];
    edgeY += texColor * Gy[2];
    texColor = luminance(texture2D(tDiffuse, v_uv3).rgb);
    edgeX += texColor * Gx[3];
    edgeY += texColor * Gy[3];
    texColor = luminance(texture2D(tDiffuse, v_uv4).rgb);
    edgeX += texColor * Gx[4];
    edgeY += texColor * Gy[4];
    texColor = luminance(texture2D(tDiffuse, v_uv5).rgb);
    edgeX += texColor * Gx[5];
    edgeY += texColor * Gy[5];
    texColor = luminance(texture2D(tDiffuse, v_uv6).rgb);
    edgeX += texColor * Gx[6];
    edgeY += texColor * Gy[6];
    texColor = luminance(texture2D(tDiffuse, v_uv7).rgb);
    edgeX += texColor * Gx[7];
    edgeY += texColor * Gy[7];
    texColor = luminance(texture2D(tDiffuse, v_uv8).rgb);
    edgeX += texColor * Gx[8];
    edgeY += texColor * Gy[8];

    float edge = (abs(edgeX) + abs(edgeY));

    return edge;
}
void main() {
    float edge = sobel();

    vec4 tDiffuseColor = texture2D(tDiffuse, vUv);
    vec4 resColor = mix(tDiffuseColor, vec4(lineColor, lineOpacity), showLine ? lineOpacity * edge : 0.0);
    gl_FragColor = resColor;
}