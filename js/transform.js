define([ './jquery' ], function($) {

	var prefix = null;

	[ 'Webkit', 'Moz', 'Ms', 'O' ].forEach(function(p) {
		if (p + 'Transform' in document.createElement('span').style) {
			prefix = p;
		}
	});

	function applyPrefixed(element, name, value, append) {
		if (prefix) {
			name = prefix + name[0].toUpperCase() + name.substr(1);
		}
		if (append) {
			value = element.style[name] + ' ' + value;
		}
		element.style[name] = value;
	}

	function numberToDeg(val) {
		return typeof val === 'number' ? val.toFixed(5) + 'deg' : val;
	}

	function numberToPx(val) {
		return typeof val === 'number' ? val.toFixed(5) + 'px' : val;
	}

	$.extend($.fn, {
		translate : function(x, y, z) {
			$.each(this, function() {
				applyPrefixed(this, 'transform', 'translate3d(' + numberToPx(x) + ','
						+ numberToPx(y) + ',' + numberToPx(z) + ')', true);
			});
			return this;
		},
		scale : function(sx, sy, sz) {
			$.each(this, function() {
				sy = sy !== undefined ? sy : sx;
				sz = sz !== undefined ? sz : sx;
				applyPrefixed(this, 'transform', 'scale3d(' + sx.toFixed(5) + ',' + sy.toFixed(5)
						+ ',' + sz.toFixed(5) + ')', true);
			});
			return this;
		},
		rotateZ : function(a) {
			$.each(this, function() {
				applyPrefixed(this, 'transform', 'rotateZ(' + numberToDeg(a) + ')', true);
			});
			return this;
		},
		rotateX : function(a) {
			$.each(this, function() {
				applyPrefixed(this, 'transform', 'rotateX(' + numberToDeg(a) + ')', true);
			});
			return this;
		},
		rotateY : function(a) {
			$.each(this, function() {
				applyPrefixed(this, 'transform', 'rotateY(' + numberToDeg(a) + ')', true);
			});
			return this;
		},
		prefix : function(name, value, append) {
			$.each(this, function() {
				applyPrefixed(this, name, numberToPx(value), append);
			});
			return this;
		},
		preserve3d : function() {
			$.each(this, function() {
				applyPrefixed(this, 'transformStyle', 'preserve-3d');
			});
			return this;
		},
		origin : function(x, y) {
			$.each(this, function() {
				applyPrefixed(this, 'transformOrigin', numberToPx(x) + ' ' + numberToPx(y));
			});
			return this;
		},
		perspective : function(value) {
			$.each(this, function() {
				applyPrefixed(this, 'perspective', numberToPx(value));
			});
			return this;
		},
		backfaceVisible : function(value) {
			$.each(this, function() {
				applyPrefixed(this, 'backfaceVisibility', value ? 'visible' : 'hidden');
			});
			return this;
		},
		matrix : function(values) {
			$.each(this, function() {
				for ( var i = 0; i < values.length; i++) {
					values[i] = values[i].toFixed(5);
				}
				applyPrefixed(this, 'transform', 'matrix3d(' + values.join(',') + ')', true);
			});
			return this;
		},
		transform : function(t) {
			$.each(this, function() {
				applyPrefixed(this, 'transform', t);
			});
			return this;
		},
		clearTransform : function() {
			$.each(this, function() {
				applyPrefixed(this, 'transform', '');
			});
			return this;
		}
	});

	var lastTime = 0;
	var vendors = [ 'ms', 'moz', 'webkit', 'o' ];
	for ( var x = 0; (x < vendors.length) && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
				|| window[vendors[x] + 'CancelRequestAnimationFrame'];
	}

	if (!window.requestAnimationFrame) {
		window.requestAnimationFrame = function(callback, element) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function() {
				callback(currTime + timeToCall);
			}, timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};
	}

	if (!window.cancelAnimationFrame) {
		window.cancelAnimationFrame = function(id) {
			clearTimeout(id);
		};
	}

	return {};
});