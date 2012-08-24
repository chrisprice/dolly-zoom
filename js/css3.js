require([ './jquery', './transform', './constants', './css3-geometry', './dat.gui.min' ], function(
		$, transform, constants, geometry) {

	var LOG_PERSPECTIVE = 'log(perspective)';
	var PERSPECTIVE = 'perspective';
	var MAX = 100000;

	var options = {};
	options[PERSPECTIVE] = 500;
	options[LOG_PERSPECTIVE] = Math.log(options[PERSPECTIVE]);
	options.translateZ = 432;
	options.translateY = 0;

	var container = $('#container').perspective(options[PERSPECTIVE]);

	container.children().each(function(i) {
		var img = $(this);
		img.translate.apply(img, constants.positions[i]);
	});

	var steps = $('<div/>').preserve3d().width(600).height(400).appendTo(container);

	geometry.create(steps);

	var gui = new dat.GUI();
	gui.add(options, LOG_PERSPECTIVE, Math.log(constants.min), Math.log(MAX)).listen().onChange(
			function(value) {
				options[PERSPECTIVE] = Math.exp(options[LOG_PERSPECTIVE]);
				container.perspective(options[PERSPECTIVE]);
			});
	gui.add(options, PERSPECTIVE, constants.min, MAX).listen().onChange(function(value) {
		options[LOG_PERSPECTIVE] = Math.log(options[PERSPECTIVE]);
		container.perspective(options[PERSPECTIVE]);
	});
	gui.add(options, 'translateY', -300, 0).listen().onChange(function(value) {
		steps.clearTransform().translate(0, options.translateY, options.translateZ);
	});
	gui.add(options, 'translateZ', 0, 3600).listen().onChange(function(value) {
		steps.clearTransform().translate(0, options.translateY, options.translateZ);
	});

});
