define(function(){

	var create = function(o, io, cb) {
		require(['jquery', 'util'], function($, util) {

			var e = $('<input type="range" class="slider" min="'+(typeof o.min === 'number' ? o.min : 0)+'" max="'+(typeof o.max === 'number' ? o.max : 10)+'" value="'+(typeof o.value === 'number' ? o.value : 5)+'" />');

			util.applyCommonOptions(e, o, io);

			//if (o.x) e.css('left', (o.x+util.margin) + 'vmin');
			//if (o.y) e.css('top', (o.y+util.margin) + 'vh');
			if (o.style && o.style.indexOf('vertical') > -1) {
				if (o.w) e.css('height', (o.w-util.margin*2) + 'vmin');
				if (o.h) e.css('width', (o.h-util.margin*2) + 'vmin');
			}

			if (o.style) e.addClass(o.style);

			cb({
				element: e
			});

		});
	};

	return create;
});
