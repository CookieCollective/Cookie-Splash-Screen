
loadFiles('shaders/', ['common.glsl', 'shader.vert', 'shader.frag'], function(shaders) {

	const gl = document.getElementById("canvas").getContext("webgl");

	const planeBuffer = twgl.createBufferInfoFromArrays(gl, {
		position: [-1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0]
	});

	var materials = {};
	var materialMap = {
		'simple': ['shader.vert', 'shader.frag'],
	};
	loadMaterials();

	// const image = twgl. { src: "images/clover.jpg" };

	const uniforms = {
		time: 0,
		resolution: [1,1],
	};

	function render(elapsed) {
		elapsed /= 1000;
		uniforms.time = elapsed;

		draw('simple');

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
