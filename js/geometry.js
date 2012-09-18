define(function() {
	var WIDTH = 400;
	var FLIGHT_COUNT = 12;
	var STEP_COUNT = 8;
	var STEP_WIDTH = WIDTH / 6;
	var STEP_HEIGHT = (WIDTH - 2 * STEP_WIDTH) / STEP_COUNT;
	var STEP_DEPTH = STEP_HEIGHT;
	var FLIGHT_DEPTH = STEP_DEPTH * STEP_COUNT;
	var DEPTH = FLIGHT_DEPTH * FLIGHT_COUNT;

	function makeSteps(cb, index, offset) {
		for ( var i = 0; i < STEP_COUNT; i++) {
			var z = -DEPTH + STEP_DEPTH * i + offset;
			var h = i === STEP_COUNT - 1 ? STEP_WIDTH + STEP_HEIGHT : STEP_HEIGHT;
			var x = null, y = null, r = null;
			switch (index % 4) {
			case 0:
				x = -WIDTH / 2 + STEP_WIDTH / 2;
				y = -WIDTH / 2 + STEP_WIDTH + i * STEP_HEIGHT + h / 2;
				r = 0;
				break;
			case 1:
				x = -WIDTH / 2 + STEP_WIDTH + i * STEP_HEIGHT + h / 2;
				y = WIDTH / 2 - STEP_WIDTH / 2;
				r = Math.PI / 2;
				break;
			case 2:
				x = WIDTH / 2 - STEP_WIDTH / 2;
				y = WIDTH / 2 - STEP_WIDTH - i * STEP_HEIGHT - h / 2;
				r = Math.PI;
				break;
			case 3:
				x = WIDTH / 2 - STEP_WIDTH - i * STEP_HEIGHT - h / 2;
				y = -WIDTH / 2 + STEP_WIDTH / 2;
				r = Math.PI / 2 * 3;
				break;
			}
			cb({
				position : [ x, y, z ],
				rotation : [ 0, 0, r ],
				height : h,
				width : STEP_WIDTH,
				type : 'step'
			});
		}
	}

	function makeGeometry(cb) {
		// floor
		cb({
			position : [ 0, 0, -DEPTH ],
			rotation : [ 0, 0, 0 ],
			height : WIDTH,
			width : WIDTH,
			type : 'floor'
		});

		// walls
		cb({// top
			position : [ 0, WIDTH / 2, -DEPTH / 2 ],
			rotation : [ -Math.PI / 2, 0, 0 ],
			height : DEPTH,
			width : WIDTH,
			type : 'wall'
		});
		cb({// right
			position : [ WIDTH / 2, 0, -DEPTH / 2 ],
			rotation : [ -Math.PI / 2, -Math.PI / 2, 0 ],
			height : DEPTH,
			width : WIDTH,
			type : 'wall'
		});
		cb({// bottom
			position : [ 0, -WIDTH / 2, -DEPTH / 2 ],
			rotation : [ -Math.PI / 2, -Math.PI, 0 ],
			height : DEPTH,
			width : WIDTH,
			type : 'wall'
		});
		cb({// left
			position : [ -WIDTH / 2, 0, -DEPTH / 2 ],
			rotation : [ -Math.PI / 2, Math.PI / 2, 0 ],
			height : DEPTH,
			width : WIDTH,
			type : 'wall'
		});
		for ( var i = 0; i < FLIGHT_COUNT; i++) {
			makeSteps(cb, i, i * FLIGHT_DEPTH);
		}
	}

	return {
		create : makeGeometry
	};
});