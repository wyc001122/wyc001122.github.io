varying vec2 vHighPrecisionZW;
varying vec3 world_position;
varying vec3 world_normal;

varying vec4 v_screenPos;
void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * worldPosition;
    vec4 clipPosition = projectionMatrix * viewPosition;

    world_position = (modelMatrix * vec4(position, 1.0)).xyz; // 世界坐标系下的顶点坐标
    world_normal = mat3(transpose(inverse(modelMatrix))) * normal; // 世界坐标系下的法线

    gl_Position = clipPosition;
    v_screenPos = clipPosition;
    vHighPrecisionZW = clipPosition.zw;
}
