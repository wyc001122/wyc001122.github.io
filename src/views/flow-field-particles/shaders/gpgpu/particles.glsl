uniform float uTime;
uniform float uDeltaTime;
uniform sampler2D uBase;
uniform float uFlowFieldInfluence;
uniform float uFlowFieldStrength;
uniform float uFlowFieldFrequency;

#include ../includes/simplexNoise4d.glsl

void main()
{
    float time = uTime * 0.2;
    vec2 uv = gl_FragCoord.xy / resolution.xy;

    // 从纹理中读取当前粒子的状态
    vec4 particle = texture(uParticles, uv);
    vec4 base = texture(uBase, uv);
    
    // 检查粒子是否"死亡"（生命周期结束）
    if(particle.a >= 1.0)
    {
        particle.a = mod(particle.a, 1.0);
        particle.xyz = base.xyz;
    }

    
    else
    {
        // 对于"活着"的粒子，它计算一个强度值（流场对粒子的影响程度）
        float strength = simplexNoise4d(vec4(base.xyz * 0.2, time + 1.0));
        float influence = (uFlowFieldInfluence - 0.5) * (- 2.0);
        strength = smoothstep(influence, 1.0, strength);

        // 流场使用 4D 柏林噪声生成，为粒子运动提供一个看似随机但连贯的方向
        vec3 flowField = vec3(
            simplexNoise4d(vec4(particle.xyz * uFlowFieldFrequency + 0.0, time)),
            simplexNoise4d(vec4(particle.xyz * uFlowFieldFrequency + 1.0, time)),
            simplexNoise4d(vec4(particle.xyz * uFlowFieldFrequency + 2.0, time))
        );
        flowField = normalize(flowField);

        // 更新粒子位置 
        particle.xyz += flowField * uDeltaTime * strength * uFlowFieldStrength;

        // 更新粒子的生命周期
        particle.a += uDeltaTime * 0.3;
    }
    
    gl_FragColor = particle;
}