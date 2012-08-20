require([ './jquery', './transform', './constants', './dat.gui.min', './Three' ], function($,
		transform, constants) {

	var LOG_DISTANCE = 'log(distance)';
	var FOV = 'fov';
	var DISTANCE = 'distance';
	var REVEAL_CAMERA = 'alternativeView';
	var FRUSTUM = 'cameraFrustum';
	var AXIS_HELPER = 'originMarker';

	var WIDTH = 600, HEIGHT = 400, DEPTH = 400 + 5; // prevent z-fighting

	function calcFov(distance) {
		return (360 * Math.atan(HEIGHT / (2 * distance))) / Math.PI;
	}

	function calcDistance(fov) {
		return HEIGHT / (2 * Math.tan(fov / 360 * Math.PI));
	}

	var options = {};
	options[DISTANCE] = 500;
	options[LOG_DISTANCE] = Math.log(options[DISTANCE]);
	options[FOV] = calcFov(options[DISTANCE]);
	options[REVEAL_CAMERA] = false;
	options[FRUSTUM] = false;
	options[AXIS_HELPER] = false;
	options.needsUpdate = false;

	var container = $('#container');

	var scene = new THREE.Scene();

	var axisHelper = new THREE.AxisHelper();
	scene.add(axisHelper);

	var texture = THREE.ImageUtils.loadTexture("images/noun_project_308.png",
			new THREE.UVMapping(), function() {
				options.needsUpdate = true;
			});

	constants.positions.forEach(function(pos) {
		var material = new THREE.MeshBasicMaterial({
			map : texture,
			transparent : true,
			opacity : 0.5
		});
		var geometry = new THREE.PlaneGeometry(100, 100, 1, 1);
		var mesh = new THREE.Mesh(geometry, material);
		mesh.position.set.apply(mesh.position, pos);
		mesh.doubleSided = true;
		mesh.rotation.x = Math.PI / 2;
		scene.add(mesh);
	});

	var camera = new THREE.PerspectiveCamera(options[FOV], WIDTH / HEIGHT, options[DISTANCE]
			- DEPTH / 2, options[DISTANCE] + DEPTH / 2);
	camera.position.z = options[DISTANCE];
	scene.add(camera);

	var cameraHelper = new THREE.CameraHelper(camera);
	scene.add(cameraHelper);

	var revealCamera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 1, 10000);
	revealCamera.position.x = 1000;
	revealCamera.position.y = 1000;
	revealCamera.position.z = -1000;
	revealCamera.lookAt(new THREE.Vector3(0, 0, 0));
	scene.add(revealCamera);

	var renderer = new THREE.WebGLRenderer({
		canvas : container[0]
	});
	renderer.setSize(WIDTH, HEIGHT);

	var gui = new dat.GUI();
	gui.add(options, LOG_DISTANCE, Math.log(constants.min), Math.log(constants.max)).listen()
			.onChange(function() {
				options[DISTANCE] = Math.exp(options[LOG_DISTANCE]);
				options[FOV] = calcFov(options[DISTANCE]);
				options.needsUpdate = true;
			});
	gui.add(options, DISTANCE, constants.min, constants.max).listen().onChange(function() {
		options[LOG_DISTANCE] = Math.log(options[DISTANCE]);
		options[FOV] = calcFov(options[DISTANCE]);
		options.needsUpdate = true;
	});
	gui.add(options, FOV, calcFov(constants.max), calcFov(constants.min)).listen().onChange(
			function() {
				options[DISTANCE] = calcDistance(options[FOV]);
				options[LOG_DISTANCE] = Math.log(options[DISTANCE]);
				options.needsUpdate = true;
			});
	gui.add(options, REVEAL_CAMERA).onChange(function() {
		options.needsUpdate = true;
	});
	gui.add(options, AXIS_HELPER).onChange(function() {
		options.needsUpdate = true;
	});
	gui.add(options, FRUSTUM).onChange(function() {
		options.needsUpdate = true;
	});

	requestAnimationFrame(function loop() {
		requestAnimationFrame(loop, container[0]);

		if (options.needsUpdate) {
			camera.fov = options[FOV];
			camera.near = options[DISTANCE] - DEPTH / 2;
			camera.far = options[DISTANCE] + DEPTH / 2;
			camera.position.z = options[DISTANCE];
			camera.updateProjectionMatrix();

			cameraHelper.update();
			cameraHelper.lines.position = camera.position;

			// move out of camera view, visibility causes strobing
			axisHelper.position.x = options[AXIS_HELPER] ? 0 : 1000000;
			cameraHelper.position.x = options[FRUSTUM] ? 0 : 1000000;

			renderer.render(scene, options[REVEAL_CAMERA] ? revealCamera : camera);
		}

		options.needsUpdate = false;
	}, container[0]);
});
