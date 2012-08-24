define(function() {
	var WIDTH = 600;
	var FLIGHT_COUNT = 12;
	var STEP_COUNT = 8;
	var STEP_WIDTH = WIDTH / 6;
	var STEP_HEIGHT = (WIDTH - 2 * STEP_WIDTH) / STEP_COUNT;
	var STEP_DEPTH = STEP_HEIGHT;
	var FLIGHT_DEPTH = STEP_DEPTH * STEP_COUNT;
	var DEPTH = FLIGHT_DEPTH * (FLIGHT_COUNT);
	var PILLAR_WIDTH = STEP_WIDTH / 5;

	function makeVerticalTube(cb, x, y, width, type, insideOut) {
		var rotYOffset = insideOut ? Math.PI : 0;
		cb({// top
			position : [ x, y + width / 2, -DEPTH / 2 ],
			rotation : [ -Math.PI / 2, rotYOffset, 0 ],
			height : DEPTH,
			width : width,
			type : type
		});
		cb({// right
			position : [ x + width / 2, y, -DEPTH / 2 ],
			rotation : [ -Math.PI / 2, rotYOffset - Math.PI / 2, 0 ],
			height : DEPTH,
			width : width,
			type : type
		});
		cb({// bottom
			position : [ x, y - width / 2, -DEPTH / 2 ],
			rotation : [ -Math.PI / 2, rotYOffset - Math.PI, 0 ],
			height : DEPTH,
			width : width,
			type : type
		});
		cb({// left
			position : [ x - width / 2, y, -DEPTH / 2 ],
			rotation : [ -Math.PI / 2, rotYOffset + Math.PI / 2, 0 ],
			height : DEPTH,
			width : width,
			type : type
		});
	}

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
			if (i === Math.round(STEP_COUNT / 2)) {
				cb({
					position : [ x, y, z + FLIGHT_DEPTH / 2 ],
					type : 'light'
				});
			}
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
		makeVerticalTube(cb, 0, 0, WIDTH, 'wall', false);

		// // pillars
		var pillarOffset = WIDTH / 2 - STEP_WIDTH - PILLAR_WIDTH / 2;
		makeVerticalTube(cb, pillarOffset, pillarOffset, PILLAR_WIDTH, 'pillar', true);
		makeVerticalTube(cb, pillarOffset, -pillarOffset, PILLAR_WIDTH, 'pillar', true);
		makeVerticalTube(cb, -pillarOffset, -pillarOffset, PILLAR_WIDTH, 'pillar', true);
		makeVerticalTube(cb, -pillarOffset, pillarOffset, PILLAR_WIDTH, 'pillar', true);

		// steps
		for ( var i = 0; i < FLIGHT_COUNT; i++) {
			makeSteps(cb, i, i * FLIGHT_DEPTH + 1);
		}

		cb({
			position : [ 0, 0, -DEPTH + 300 ],
			type : 'light'
		});

	}

	return {
		create : makeGeometry
	};
});