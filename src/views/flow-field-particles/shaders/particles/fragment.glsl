varying vec3 vColor;

void main()
{   
    // 计算当前片段到粒子中心的距离。gl_PointCoord 是一个内置变量，表示点精灵中的坐标（范围从 0 到 1）。减去 0.5 是为了将坐标系原点移到中心。
    float distanceToCenter = length(gl_PointCoord - 0.5);
    if(distanceToCenter > 0.5)
        discard;
    
    gl_FragColor = vec4(vColor, 1.0);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}