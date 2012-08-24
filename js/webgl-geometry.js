define([ './jquery', './transform', './geometry', './dat.gui.min', './Three' ], function($,
		transform, geometry) {

	return {
		create : function(container) {
			var scene = new THREE.Scene();

			var floorMaterial = new THREE.MeshLambertMaterial({
				map : THREE.ImageUtils.loadTexture("images/checked.png")
			});
			floorMaterial.map.wrapS = THREE.RepeatWrapping;
			floorMaterial.map.wrapT = THREE.RepeatWrapping;
			floorMaterial.map.repeat.x = 16;
			floorMaterial.map.repeat.y = 16;
			var wallMaterial = new THREE.MeshLambertMaterial({
				map : THREE.ImageUtils.loadTexture("images/pinstripe.png")
			});
			wallMaterial.map.wrapS = THREE.RepeatWrapping;
			wallMaterial.map.wrapT = THREE.RepeatWrapping;
			wallMaterial.map.repeat.x = 32;
			wallMaterial.map.repeat.y = 32;
			var stepMaterial = new THREE.MeshLambertMaterial({
				color : 0xffa500
			});
			var pillarMaterial = new THREE.MeshLambertMaterial({
				color : 0x000000
			});

			geometry.create(function(geo) {
				if (geo.type === 'light') {
					var light = new THREE.PointLight(0xffffff, 1, 600);
					light.position.set(geo.position[0], geo.position[1], geo.position[2] + 432);
					scene.add(light);
					return;
				}
				var material = stepMaterial;
				if (geo.type === 'floor') {
					material = floorMaterial;
				}
				if (geo.type === 'wall') {
					material = wallMaterial;
				}
				if (geo.type === 'pillar') {
					material = pillarMaterial;
				}
				var geometry = new THREE.PlaneGeometry(geo.width, geo.height, 1, 1);
				var mesh = new THREE.Mesh(geometry, material);
				mesh.rotation.x += Math.PI / 2;
				var rotatedGeometry = new THREE.Geometry();
				THREE.GeometryUtils.merge(rotatedGeometry, mesh);
				mesh = new THREE.Mesh(rotatedGeometry, material);
				mesh.position.set(geo.position[0], geo.position[1], geo.position[2] + 432);
				mesh.rotation.set(-geo.rotation[0], geo.rotation[1], geo.rotation[2]);
				scene.add(mesh);
			});

			return scene;
		}
	};
});
