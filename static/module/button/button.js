define(function(){

	var create = function(o, io, cb) {
		require(['jquery', 'util'], function($, util) {

			var e = $('<button class="button"></button>');

			util.applyCommonOptions(e, o, io);

			if (o.icon) {
				e.addClass('mdi mdi-'+o.icon);
				if (o.h) e.css('font-size', (o.h - util.margin*2) + 'vmin');
				//e.addClass('color');
			}

			if (o.img) {
				var img = $('<span class="img"></span>');
				e.append(img);
				img.css('background-image', 'url('+o.img+')');
				if (o.imgpos) img.css('background-position', o.imgpos);
			}

			cb({
				element: e
			});

		});
	};

	return create;
});
