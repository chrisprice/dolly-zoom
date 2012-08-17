require([ './jquery', './transform', './dat.gui.min', './Three' ], function($, transform) {

	var LOG_DISTANCE = 'log(distance)';
	var FOV = 'fov';
	var DISTANCE = 'distance';

	var MIN = 425;
	var MAX = 100000;

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

	var container = $('#container');

	var scene = new THREE.Scene();

	var texture = THREE.ImageUtils.loadTexture("images/noun_project_308.png");

	var positions = [
			[ -200, 0, 200 ],
			[ 200, 0, 200 ],
			[ -200, 0, 0 ],
			[ 0, 0, 0 ],
			[ 200, 0, 0 ],
			[ -200, 0, -200 ],
			[ 200, 0, -200 ] ];

	positions.forEach(function(pos) {
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

	var renderer = new THREE.WebGLRenderer({
		canvas : container[0]
	});
	renderer.setSize(WIDTH, HEIGHT);

	var gui = new dat.GUI();
	gui.add(options, LOG_DISTANCE, Math.log(MIN), Math.log(MAX)).listen().onChange(function() {
		options[DISTANCE] = Math.exp(options[LOG_DISTANCE]);
		options[FOV] = calcFov(options[DISTANCE]);
	});
	gui.add(options, DISTANCE, MIN, MAX).listen().onChange(function() {
		options[LOG_DISTANCE] = Math.log(options[DISTANCE]);
		options[FOV] = calcFov(options[DISTANCE]);
	});
	gui.add(options, FOV, calcFov(MAX), calcFov(MIN)).listen().onChange(function() {
		options[DISTANCE] = calcDistance(options[FOV]);
		options[LOG_DISTANCE] = Math.log(options[DISTANCE]);
	});
	;

	requestAnimationFrame(function loop() {
		requestAnimationFrame(loop, container[0]);

		camera.fov = options[FOV];
		camera.near = options[DISTANCE] - DEPTH / 2;
		camera.far = options[DISTANCE] + DEPTH / 2;
		camera.position.z = options[DISTANCE];
		camera.updateProjectionMatrix();

		renderer.render(scene, camera);
	}, container[0]);
});
