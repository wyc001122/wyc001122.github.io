uniform float uTime;

varying vec3 vNormal;
varying vec3 vColor;
varying vec2 vUv;

void main() {

    vec3 light = vec3(0.);
    vec3 skyColor = vec3(1., 1., .574);
    vec3 groundColor = vec3(.562, .275, .111);

    vec3 lightDirection = normalize(vec3(0., -1., -1.));

    light += dot(lightDirection, vNormal);

    light = mix(skyColor, groundColor, dot(lightDirection, vNormal));

    gl_FragColor = vec4(vec3(light * vColor), 1.0);
    // gl_FragColor = vec4(vColor, 1.0);
    // #include <tonemapping_fragment>
    // #include <colorspace_fragment>
}