#include <common>
#include <packing>

uniform float uIntersectPower;
uniform vec3 uRimColor;
uniform float uRimPower;
uniform float uRimIntensity;
uniform float uFar;
uniform float uNear;
uniform sampler2D uSceenDepth;

varying vec3 world_position;
varying vec3 world_normal;
varying vec4 v_screenPos;

float linear01Depth(const in float ndcZ) {
    float q1 = (uNear - uFar) * ndcZ / uNear;
    float q2 = uFar / uNear;
    return 1. / (q1 + q2);
}

void main() {
    vec3 screenUV = v_screenPos.xyz / v_screenPos.w * 0.5 + 0.5; // ndc坐标

    vec3 viewDir = normalize(cameraPosition - world_position);
    float fRim = 1.0 - abs(dot(normalize(world_normal), viewDir));
    fRim = pow(fRim, uRimPower);

    float screenDepth = unpackRGBAToDepth(texture2D(uSceenDepth, screenUV.xy));
    screenDepth = linear01Depth(screenDepth);

    float sphereZ = linear01Depth(v_screenPos.z / v_screenPos.w * 0.5 + 0.5);

    float diff = clamp(screenDepth - sphereZ, 0.0, 1.0);
    float fIntersect = pow(1.0 - diff, uIntersectPower);

    float factor = max(fRim, fIntersect);

    vec4 resColor = vec4(uRimColor, 1.) * factor * uRimIntensity;
    gl_FragColor = resColor;//resColor;

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
