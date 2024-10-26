

varying vec2 vUv;
varying vec3 world_position;
varying vec3 world_normal;
varying vec4 v_screenPos;
void main() {
    vUv = uv;
    v_screenPos = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

    world_position = (modelMatrix * vec4(position, 1.0)).xyz; // 世界坐标系下的顶点坐标
    world_normal = mat3(transpose(inverse(modelMatrix))) * normal; // 世界坐标系下的法线
    gl_Position = v_screenPos;
}
