varying vec2 vUv;

// 定义三个uniform变量，用于接收JavaScript传递的数据
uniform sampler2D uCurrentPosition; // 当前位置的纹理
uniform sampler2D uOriginalPosition; // 原始位置的纹理
uniform vec3 uMouse; // 鼠标位置

void main() {
    float radius = 0.01;
    // 从当前位置纹理中获取当前位置
    vec2 position = texture2D(uCurrentPosition, vUv).xy;
    // 从原始位置纹理中获取原始位置
    vec2 original = texture2D(uOriginalPosition, vUv).xy;

    // 计算从原始位置指向鼠标位置的力
    vec2 force = original - uMouse.xy;

    // 计算力的长度
    float len = length(force) * 150.;
    // 计算力的因子，距离越远，力越小
    float forceFactor = 1. / max(1., len);

    // 计算粒子应该移动到的位置
    vec2 positionToGo = original + normalize(force) * forceFactor * 0.6;

    // 使用插值让粒子平滑地移动到目标位置
    position.xy += (positionToGo - position.xy) * 0.05;

    // 将新的位置写入到输出颜色中
    gl_FragColor = vec4(position, 0.0, 1.0);
}