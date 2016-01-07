/*	A plugin module for loading.js
 *	
 *	loading.js plugins should not use any external JS library commands if possible.
 *		DOM manipulation should be brovided by base loading.js class. (unless you are
 *		designing a highly specific animation just for your web app ;)
 *	
 *	This animation provides a floating sideway loading effect similar to that seen 
 *		in office apps like Outlook.
 * 
 */
(function(window){

var module = (function(){

	constructor = function(lib) {
		return {
			start: function(el, ops) {
				var 
					// setup elements
					fade = lib.createElement('div'),
					spin = lib.createElement('div'),
					// init vars for animation
					interval = null,
					xOffset = 50,
					// function that animates the bar
					animator = function() {
						lib.setStyle(spin, 'backgroundPosition', ++xOffset + 'em 0px');
					},
					// setup a stop function
					stop = function() {
						lib.remove(fade, spin);
						lib.remove(el, fade);
						if (interval) clearInterval(interval);
					};
				
				// setup the element so that child eleemtns can be positioned absolutely
				if (lib.getStyle(el, 'position') != 'absolute')
					lib.setStyle(el, 'position', 'relative');
				
				// setup styles of semi-opaque cover
				lib.setStyles(fade, {
					'position': 'absolute',
					'width': '100%',
					'height': '100%',
					'backgroundColor': 'rgba(255,255,255,0.3)',
					'z-index': 10000
				});
				
				// setup styles of spinner
				lib.setStyles(spin, {
					'position': 'absolute',
					'width': '100%',
					'height': '0.6%',
					'bottom': '0px',
					'background': '-moz-linear-gradient(left,  #ffffff 0%, #f7a409 50%, #ffffff 100%)', /* FF3.6+ */
					'background': '-webkit-gradient(linear, left top, right top, color-stop(0%,#ffffff), color-stop(50%,#f7a409), color-stop(100%,#ffffff))', /* Chrome,Safari4+ */
					'background': '-webkit-linear-gradient(left,  #ffffff 0%,#f7a409 50%,#ffffff 100%)', /* Chrome10+,Safari5.1+ */
					'background': '-o-linear-gradient(left,  #ffffff 0%,#f7a409 50%,#ffffff 100%)', /* Opera 11.10+ */
					'background': '-ms-linear-gradient(left,  #ffffff 0%,#f7a409 50%,#ffffff 100%)', /* IE10+ */
					'background': 'linear-gradient(to right,  #ffffff 0%,#f7a409 50%,#ffffff 100%)', /* W3C */
					'filter': 'progid:DXImageTransform.Microsoft.gradient( startColorstr=\'#ffffff\', endColorstr=\'#ffffff\',GradientType=1 )' /* IE6-9 */
				});
				
				// add the spinner to the cover, and the cover to the element
				lib.append(fade, spin);
				lib.append(el, fade);
				
				// setup and start the animation
				interval = setInterval(animator, 23);
				
				// return stop function
				return {
					stop: stop
				};
			}
		};
	};
	
	// use the constructor defined above to wrap the logic of setting up this module. return the result of constructor()
	return constructor;
	
});

/* These style of these ifs below were learned from JQueries compensation for detecting RequireJS
 *
 * So if RequireJS is being used, the module will be made available through the usual callback
 *		that RequireJS provides.
 *
 * If RequireJS is not detected, a global variable called 'loading' will be created.
 *
 */
if (window['define'] !== undefined) {
	define(module);
} else {
	window['loading'].plugin('throb', module);
}


if (typeof define === 'function' && define.amd) {
	define('loading.anim.throb', [], module);
} else {
	window.loader.plugin('throb', module);
}

})( window );
