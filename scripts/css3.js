define('css3', [ 'lib/jquery', 'transform', 'constants', 'lib/dat.gui.min' ], function($, transform,
		constants) {

	var LOG_PERSPECTIVE = 'log(perspective)';
	var PERSPECTIVE = 'perspective';
	var MAX = 100000;

	var options = {};
	options[PERSPECTIVE] = 500;
	options[LOG_PERSPECTIVE] = Math.log(options[PERSPECTIVE]);

	var container = $('#container').perspective(options[PERSPECTIVE]);

	container.children().each(function(i) {
		var img = $(this);
		img.translate.apply(img, constants.positions[i]);
    // also set z-index to the z-position to correct the stacking
		img.css('zIndex', constants.positions[i][2]);
	});

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
});
