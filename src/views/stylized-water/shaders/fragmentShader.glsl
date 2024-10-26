uniform samplerCube uReflectTexture;
uniform sampler2D uNoiseTexture;
uniform vec3 uFresnelColor;
uniform float uNoisePow;
uniform float uTime;
uniform float uWaterSpeed;
uniform float uNoiseScale;
uniform float uWaterOpacity;
uniform float uReflectPow;

varying vec3 reflectVec;
varying float fresnel;
varying vec2 v_uv;
varying vec3 world_position;

void main() {
  float T = texture2D(uNoiseTexture, v_uv + world_position.xz * uNoiseScale + uTime * uWaterSpeed).r; // 采样噪声贴图
  vec3 newReflectVec = reflectVec + T * uNoisePow; // 噪声偏移反射向量

  vec4 skyColor = textureCube(uReflectTexture, newReflectVec); // 根据新的反射向量采样环境贴图
  skyColor = mix(skyColor, vec4(uFresnelColor, 1.), fresnel * uReflectPow); // 混合菲涅尔效应

  vec4 waterColor = vec4(skyColor.rgb, uWaterOpacity);
  waterColor.rgb = mix(waterColor.rgb, vec3(1.), smoothstep(0.91, 0.911, T));

  vec2 D = v_uv - vec2(.5);
  waterColor.rgb = mix(waterColor.rgb, uFresnelColor.rgb, smoothstep(0., .2, dot(D, D)));

  gl_FragColor = waterColor;

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}