uniform float time;
uniform float progress;
uniform sampler2D uDots;
uniform sampler2D uStripes;
uniform vec4 resolution;
varying vec2 vUv;
varying vec3 vPosition;
float PI = 3.141592653589793238;
varying vec3 vWorldPosition;
varying vec3 vNormal;





void main()	{
	float time1 = time * 0.01;
	float texture1 = texture2D(uStripes, vUv - vec2(time1)).r;
	float texture11 = texture2D(uStripes, vUv - time1*1.5).r;
	float texture3 = texture2D(uDots, vUv*vec2(8.,4.) - time1*4.5).r;
	float alpha = min(texture1, texture11) + texture3;
	vec3 color = vec3(0.136, 0.559, 0.832);

	vec3 viewDir = -normalize(vWorldPosition.xyz - cameraPosition);

	float fresnel =  dot(viewDir, vNormal);
	fresnel = pow( fresnel, 3.0);

	vec3 color1 = vec3(0.579, 0.903, 0.983);
	gl_FragColor = vec4(color1,1.);
	gl_FragColor = vec4(vUv,0.,1.);
	gl_FragColor = vec4(vec3(color1),alpha*fresnel);
	// gl_FragColor = vec4(vec3(fresnel),1.);
	// gl_FragColor = vec4(vec3(vNormal),1.);
}