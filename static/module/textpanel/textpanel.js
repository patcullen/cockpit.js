define(function(){

	var create = function(o, io, cb) {
		require(['jquery', 'util'], function($, util) {

			var e = $('<input type="text" class="text"></text>');

			util.applyCommonOptions(e, o, io);
			if (o.h) e.css('font-size', (o.h*0.7) + 'vmin');
			if (o.value) e.val(o.value);


			cb({
				element: e
			});

		});
	};

	return create;
});
