
uniform sampler2D image, frame;

varying vec2 uv;

void main ()
{
	vec3 color = vec3(0);
	float aspect = resolution.x / resolution.y;
	vec2 pos = (uv * 2. - 1.) * vec2(aspect, 1);
	// vec2 offset = vec2(2.*sin(time)/resolution.x, 0);
	float dist = length(pos);
	vec2 offset = normalize(pos) * 0.01;
	offset *= rotation(dist+time);
	vec4 frame = texture2D(frame, uv + offset);
	vec4 map = texture2D(image, pos) * step(0.0, uv.x);
	color = mix(frame.rgb * 0.9, map.rgb, map.a);
	gl_FragColor = vec4(color, 1);
}