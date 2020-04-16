
loadFiles('shaders/', ['common.glsl', 'screen.vert', 'simple.frag', 'render.frag', 'rainbow-lazer.frag', 'feedback.frag', 'rainbow-array.frag'], function(shaders) {

	const gl = document.getElementById("canvas").getContext("webgl");

	const frames = [ twgl.createFramebufferInfo(gl), twgl.createFramebufferInfo(gl) ];
	var currentFrame = 0;

	const planeBuffer = twgl.createBufferInfoFromArrays(gl, {
		position: [ -1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0 ]
	});

	var materials = {};
	var materialMap = {
		'simple': 					['screen.vert', 		'simple.frag'],
		'rainbow-lazer': 		['screen.vert', 		'rainbow-lazer.frag'],
		'rainbow-array': 		['screen.vert', 		'rainbow-array.frag'],
		'feedback': 				['screen.vert', 		'feedback.frag'],
		'render': 					['screen.vert', 		'render.frag'],
	};
	loadMaterials();

	var keysMaterial = Object.keys(materialMap);
	var currentMaterial = 0;
	var elapsedMaterial = 0;
	var durationMaterial = 3;

	const uniforms = {
		time: 0,
		resolution: [1,1],
		frame: 0,

		// http://twgljs.org/docs/module-twgl.html#.TextureOptions
		image: twgl.createTexture(gl, {
			src: "images/CookieCollective.png",
			flipY: true
		}),
	};

	function render(elapsed) {
		elapsed /= 1000;
		var dt = elapsed - uniforms.time;
		uniforms.time = elapsed;

		gl.bindFramebuffer(gl.FRAMEBUFFER, frames[currentFrame].framebuffer);
		uniforms.frame = frames[(currentFrame+1)%2].attachments[0];
		// draw('rainbow-array');
		draw(keysMaterial[currentMaterial]);

		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		draw('render');

		currentFrame = (currentFrame+1)%2;
		if (elapsedMaterial > durationMaterial) {
			elapsedMaterial = 0;
			currentMaterial = (currentMaterial+1)%(keysMaterial.length-1);
		} else {
			elapsedMaterial += dt;
		}
		requestAnimationFrame(render);
	}

	function draw(shaderName) {
		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
		gl.useProgram(materials[shaderName].program);
		twgl.setBuffersAndAttributes(gl, materials[shaderName], planeBuffer);
		twgl.setUniforms(materials[shaderName], uniforms);
		twgl.drawBufferInfo(gl, planeBuffer, gl.TRIANGLES);
	}

	function loadMaterials() {
		Object.keys(materialMap).forEach(function(key) {
			materials[key] = twgl.createProgramInfo(gl,
				[shaders['common.glsl']+shaders[materialMap[key][0]],shaders['common.glsl']+shaders[materialMap[key][1]]]); });
	}

	function onWindowResize() {
		twgl.resizeCanvasToDisplaySize(gl.canvas);
		twgl.resizeFramebufferInfo(gl, frames[0]);
		twgl.resizeFramebufferInfo(gl, frames[1]);
		uniforms.resolution = [gl.canvas.width, gl.canvas.height];
	}

	onWindowResize();
	window.addEventListener('resize', onWindowResize, false);

	requestAnimationFrame(render);

	// shader hot-reload
	socket = io('http://localhost:5776');
	socket.on('change', function(data) { 
		if (data.path.includes("shaders/")) {
			const url = data.path.substr("shaders/".length);
			loadFiles("shaders/",[url], function(shade) {
				shaders[url] = shade[url];
				loadMaterials();
			});
			console.log(url)
		}
	});
	
});
