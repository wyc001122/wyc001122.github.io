#include <packing>
uniform float uTime;
uniform float uNear;
uniform float uFar;
uniform vec3 uRimColor;
uniform float uRimPow;
uniform float uRimIntensity;
uniform sampler2D uSceneTexture;
uniform sampler2D uSceneDepthTexture;
uniform sampler2D uNoiseTexture;
uniform vec2 uResolution;
uniform float uIntersectPow;
uniform vec2 uSpeed;
uniform float uDistortIntensity;

varying vec2 vUv;
varying vec3 world_position;
varying vec3 world_normal;
varying vec4 v_screenPos;

float linear01Depth(const in float ndcZ) {
  float q1 = (uNear - uFar) * ndcZ / uNear;
  float q2 = uFar / uNear;
  return 1. / (q1 + q2);
}

void main() {
  // rim color
  vec3 viewDir = normalize(cameraPosition - world_position);
  float fRim = 1.0 - abs(dot(normalize(world_normal), viewDir));
  fRim = pow(fRim, uRimPow);

  // intersect color
  vec2 screenUV = v_screenPos.xy / v_screenPos.w * 0.5 + 0.5;

  float screenDepth = unpackRGBAToDepth(texture2D(uSceneDepthTexture, screenUV));
  screenDepth = linear01Depth(screenDepth);

  float sphereZ = linear01Depth(v_screenPos.z / v_screenPos.w * 0.5 + 0.5);

  float diff = clamp(screenDepth - sphereZ, 0.0, 1.0);
  float fIntersect = 1.0 - diff;
  fIntersect = pow(fIntersect, 1000. * uIntersectPow);

  float factor = max(fRim, fIntersect);

  // distortion
  vec2 newUV = vUv + uTime * uSpeed;
  vec4 offset = texture2D(uNoiseTexture, newUV);
  screenUV.xy += (offset.xy * 2.0 - 1.0) * uDistortIntensity * 0.01;
  vec4 distortColor = texture2D(uSceneTexture, screenUV.xy);

  vec4 resColor;

  #if IS_FRONT == 1 
  resColor = vec4(uRimColor, 1.0) * factor * uRimIntensity + distortColor;
  #else
  resColor = vec4(uRimColor, 1.0) * factor * uRimIntensity;
  #endif

  gl_FragColor = resColor;

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}