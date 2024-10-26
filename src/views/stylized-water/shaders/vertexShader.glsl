uniform float uFresnelPow;

varying vec3 reflectVec;
varying float fresnel;
varying vec2 v_uv;
varying vec3 world_position;

void main() {
  vec3 world_normal = mat3(transpose(inverse(modelMatrix))) * normal; // 世界坐标系下的法线
  world_position = (modelMatrix * vec4(position, 1.0)).xyz; // 世界坐标系下的顶点坐标

  vec3 world_viewVec = normalize(world_position - cameraPosition); // 视线
  vec3 view_normal = normalize(world_normal); // 法线
  reflectVec = reflect(world_viewVec, view_normal); // 反射向量
  reflectVec.x *= -1.;
  float F0 = 0.02;
  float F90 = 1.0;
  fresnel = F0 + (F90 - F0) * pow(1.0 - dot(view_normal, -world_viewVec), uFresnelPow); // 模拟菲涅尔效应

  v_uv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}