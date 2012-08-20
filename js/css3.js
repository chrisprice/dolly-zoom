require([ './jquery', './transform', './dat.gui.min' ], function($, transform) {

	var LOG_PERSPECTIVE = 'log(perspective)';
	var PERSPECTIVE = 'perspective';
	var MIN = 425;
	var MAX = 100000;

	var options = {};
	options[PERSPECTIVE] = 500;
	options[LOG_PERSPECTIVE] = Math.log(options[PERSPECTIVE]);

	var container = $('#container').perspective(options[PERSPECTIVE]);

	$('#targetFrontLeft').translate(-200, 0, 200);
	$('#targetFrontRight').translate(200, 0, 200);
	$('#targetMiddleLeft').translate(-200, 0, 0);
	$('#targetMiddleCenter').translate(0, 0, 0);
	$('#targetMiddleRight').translate(200, 0, 0);
	$('#targetBackLeft').translate(-200, 0, -200);
	$('#targetBackRight').translate(200, 0, -200);

	var gui = new dat.GUI();
	gui.add(options, LOG_PERSPECTIVE, Math.log(MIN), Math.log(MAX)).listen().onChange(
			function(value) {
				options[PERSPECTIVE] = Math.exp(options[LOG_PERSPECTIVE]);
				container.perspective(options[PERSPECTIVE]);
			});
	gui.add(options, PERSPECTIVE, MIN, MAX).listen().onChange(function(value) {
		options[LOG_PERSPECTIVE] = Math.log(options[PERSPECTIVE]);
		container.perspective(options[PERSPECTIVE]);
	});
});
