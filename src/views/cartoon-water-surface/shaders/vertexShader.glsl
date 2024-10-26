varying float fresnel;
varying vec2 v_uv;
varying vec3 world_position;
varying vec3 world_normal;

varying vec4 v_screenPos;
varying vec3 v_viewNormal;
void main() {
    world_normal = mat3(transpose(inverse(modelMatrix))) * normal; // 世界坐标系下的法线
    world_position = (modelMatrix * vec4(position, 1.0)).xyz; // 世界坐标系下的顶点坐标
    v_uv = uv;
    vec4 newNormal = vec4(normal, 1.);
    v_viewNormal = normalize(mat3(transpose(inverse(modelMatrix * viewMatrix))) * newNormal.xyz);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    v_screenPos = gl_Position;
}