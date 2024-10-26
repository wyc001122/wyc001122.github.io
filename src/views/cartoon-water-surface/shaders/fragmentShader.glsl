#include <packing>
uniform float uTime;

uniform float uNear;
uniform float uFar;
uniform vec3 uAbedoColor;

uniform vec3 uRimColor;
uniform float uRimOpacity;
uniform float uFresnelPow;
uniform float F0;
uniform float F90;

uniform samplerCube uReflectTexture;
uniform sampler2D uReflectNoise;
uniform float uReflectPow;
uniform float uReflectScale;

uniform sampler2D uDepthTexture;
uniform float uDepthScale;
uniform float uWaterDepthPow;
uniform vec3 uShallowColor;

uniform sampler2D uCausticsTexture;
uniform float uCausticsIntensity;
uniform float uCausticsScale;

uniform sampler2D uFoamTexture;
uniform float uFoamScale;
uniform float uFoamDepthPow;
uniform float uFoamCutoff;
uniform float uFoamDistortionScale;
uniform sampler2D uNormalTexture;
uniform float uFoamMaxScale;
uniform float uFoamMinScale;

uniform sampler2D uDistortionTexture;
uniform float uDistortionIntensity;

varying vec2 v_uv;
varying vec3 world_position;
varying vec3 world_normal;
varying vec4 v_screenPos;
varying vec3 v_viewNormal;

float linear01Depth(const in float ndcZ) {
    float q1 = (uNear - uFar) * ndcZ / uNear;
    float q2 = uFar / uNear;
    return 1. / (q1 + q2);
}

void main() {
    vec3 screenUV = v_screenPos.xyz / v_screenPos.w * 0.5 + 0.5; // ndc坐标

    // reflect
    vec2 noiseUV = v_uv + world_position.xz * 0.5 + uTime * 1.;
    noiseUV *= uReflectScale;
    float noiseValue = texture2D(uReflectNoise, noiseUV).r;
    vec3 N = normalize(world_normal);
    vec3 V = normalize(world_position - cameraPosition);
    vec3 R = reflect(V, N) + noiseValue / uReflectPow;
    vec4 reflectColor = textureCube(uReflectTexture, R); // 根据新的反射向量采样环境贴图

    // fresnel
    float fresnel = F0 + (F90 - F0) * pow(1.0 - dot(N, -V), uFresnelPow); // 模拟菲涅尔效应
    vec4 baseColor = mix(vec4(uAbedoColor, 1.), reflectColor, fresnel);

    // depth 
    float screenDepth = unpackRGBAToDepth(texture2D(uDepthTexture, screenUV.xy));
    screenDepth = linear01Depth(screenDepth);

    float waterDepth = linear01Depth(v_screenPos.z / v_screenPos.w * 0.5 + 0.5);

    float depthDifference = clamp(screenDepth - waterDepth, 0.0, 1.0);

    if(depthDifference <= uDepthScale) {
        float waterDepthDifference = clamp(depthDifference / uDepthScale, 0.0, 1.0);
        waterDepthDifference = pow(waterDepthDifference, uWaterDepthPow);

        // caustics
        vec2 causticsUV1 = v_uv + world_position.xz * 2. + vec2(uTime) * 0.03;
        causticsUV1 *= uCausticsScale;
        vec2 causticsUV2 = v_uv + world_position.xz * 2. - vec2(uTime) * 0.03;
        causticsUV2 *= uCausticsScale;
        vec4 causticsColor1 = texture2D(uCausticsTexture, causticsUV1);
        vec4 causticsColor2 = texture2D(uCausticsTexture, causticsUV2);
        vec4 tempColor = vec4(uShallowColor, 1.) + min(causticsColor1, causticsColor2) * uCausticsIntensity;

        vec4 waterColor = mix(tempColor, baseColor, waterDepthDifference);
        baseColor.rgb = waterColor.rgb;
        baseColor.a = waterDepthDifference;
    }

    // foam
    vec2 foamDistortionUV = v_uv + world_position.xz * 1.0;
    foamDistortionUV *= uFoamDistortionScale;
    vec2 distortionValue = texture2D(uDistortionTexture, foamDistortionUV).xy;
    distortionValue = (distortionValue * 2.0 - 1.0) * uDistortionIntensity;

    float foamUVx = v_uv.x + world_position.x * 1.;
    foamUVx *= uFoamDistortionScale;
    float foamUVy = v_uv.y - world_position.z * 2.;
    foamUVy *= uFoamDistortionScale;

    vec2 foamUV = vec2(foamUVx + uTime * 0.03 + distortionValue.x, foamUVy + uTime * 0.03 + distortionValue.y);

    float foamSample = texture2D(uFoamTexture, foamUV).r;

    vec3 existingNormal = texture2D(uNormalTexture, screenUV.xy).rgb;
    float normalDot = clamp(dot(existingNormal, v_viewNormal.xyz), 0.0, 1.0);

    float foamScale = mix(uFoamMinScale, uFoamMaxScale, normalDot);

    if(depthDifference <= foamScale) {
        float foamDepthDifference = clamp(depthDifference / foamScale, 0.0, 1.0);
        foamDepthDifference = pow(foamDepthDifference, uFoamDepthPow);

        float foamCutoff = uFoamCutoff;
        foamCutoff *= foamDepthDifference;

        float smoothstepValue = 0.01;

        float foamValue = smoothstep(foamCutoff - smoothstepValue, foamCutoff + smoothstepValue, foamSample);
        baseColor.rgb += foamValue;
    }

    // edge
    vec2 distance = v_uv - vec2(0.5, 0.5);
    baseColor.rgb = mix(baseColor.rgb, uRimColor, uRimOpacity * smoothstep(0.0, 0.2, dot(distance, distance)));

    gl_FragColor = baseColor;

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}