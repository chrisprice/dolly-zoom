define([ './jquery', './transform', './geometry' ], function($, transform, geometry) {

	function getRotationMatrixFromEuler(v) {
		var x = v[0], y = v[1], z = v[2];
		var a = Math.cos(x), b = Math.sin(x);
		var c = Math.cos(y), d = Math.sin(y);
		var e = Math.cos(z), f = Math.sin(z);

		var ae = a * e, af = a * f, be = b * e, bf = b * f;

		return [
				c * e,
				af + be * d,
				bf - ae * d,
				0,
				-c * f,
				ae - bf * d,
				be + af * d,
				0,
				d,
				-b * c,
				a * c,
				0,
				0,
				0,
				0,
				1 ];
	}

	return {
		create : function(container) {
			container = $(container);

			geometry.create(function(geo) {
				if (geo.type === 'light') {
					return;
				}
				var plane = $('<div/>').width(geo.width - 10).height(geo.height - 10);
				plane.translate(geo.position[0], -geo.position[1], geo.position[2] + 1000);
				plane.matrix(getRotationMatrixFromEuler(geo.rotation));
				plane.backfaceVisible(false);
				plane.css({
					position : 'absolute',
					marginLeft : -geo.width / 2,
					marginTop : -geo.height / 2,
					left : '50%',
					top : '50%',
					background : 'orange',
					border : '5px solid black'
				});
				if (geo.type === 'floor') {
					plane.css('background', 'url(images/checked.png)');
				}
				if (geo.type === 'wall') {
					plane.css('background', 'url(images/pinstripe.png)');
				}
				if (geo.type === 'pillar') {
					plane.css('background', 'black');
				}
				container.append(plane);
			});

			return container;
		}
	};

});
