
uniform sampler2D image;

varying vec2 uv;

void main ()
{
	vec3 color = vec3(0);
	float aspect = resolution.x / resolution.y;
	vec2 pos = (uv * 2. - 1.) * vec2(aspect, 1) * 2.;
	float dist = length(pos);
	pos *= rotation(sin(time - dist) * .5);
	pos.x /= aspect;
	pos -= vec2(0.5);
	vec4 map = texture2D(image, fract(pos));
	color = mix(color, map.rgb, map.a);
	gl_FragColor = vec4(color, 1);
}