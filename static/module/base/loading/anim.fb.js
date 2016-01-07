/*	A plugin module for loading.js
 *	
 *	loading.js plugins should not use any external JS library commands if possible.
 *		DOM manipulation should be brovided by base loading.js class. (unless you are
 *		designing a highly specific animation just for your web app ;)
 *	
 *	This animation provides an animation similar to one that would be found on FB.
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
					// setup a stop function
					stop = function() {
						lib.remove(fade, spin);
						lib.remove(el, fade);
					};
				
				// setup the element so that child eleemtns can be positioned absolutely
				if (lib.getStyle(el, 'position') != 'absolute')
					lib.setStyle(el, 'position', 'relative');
				
				// setup styles of semi-opaque cover
				lib.setStyles(fade, {
					'position': 'absolute',
					'width': '100%',
					'height': '100%',
					'backgroundColor': 'rgba(200,200,200,0.6)',
					'z-index': 10000
				});
				
				// setup styles of spinner container
				lib.setStyles(spin, {
					'position': 'absolute',
					'width': '100%',
					'height': '100%',
					'background': 'center center no-repeat',
					'background-image': 'url(data:image/gif;base64,R0lGODlhEAALAPQAAP///wAAANra2tDQ0Orq6gYGBgAAAC4uLoKCgmBgYLq6uiIiIkpKSoqKimRkZL6+viYmJgQEBE5OTubm5tjY2PT09Dg4ONzc3PLy8ra2tqCgoMrKyu7u7gAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCwAAACwAAAAAEAALAAAFLSAgjmRpnqSgCuLKAq5AEIM4zDVw03ve27ifDgfkEYe04kDIDC5zrtYKRa2WQgAh+QQJCwAAACwAAAAAEAALAAAFJGBhGAVgnqhpHIeRvsDawqns0qeN5+y967tYLyicBYE7EYkYAgAh+QQJCwAAACwAAAAAEAALAAAFNiAgjothLOOIJAkiGgxjpGKiKMkbz7SN6zIawJcDwIK9W/HISxGBzdHTuBNOmcJVCyoUlk7CEAAh+QQJCwAAACwAAAAAEAALAAAFNSAgjqQIRRFUAo3jNGIkSdHqPI8Tz3V55zuaDacDyIQ+YrBH+hWPzJFzOQQaeavWi7oqnVIhACH5BAkLAAAALAAAAAAQAAsAAAUyICCOZGme1rJY5kRRk7hI0mJSVUXJtF3iOl7tltsBZsNfUegjAY3I5sgFY55KqdX1GgIAIfkECQsAAAAsAAAAABAACwAABTcgII5kaZ4kcV2EqLJipmnZhWGXaOOitm2aXQ4g7P2Ct2ER4AMul00kj5g0Al8tADY2y6C+4FIIACH5BAkLAAAALAAAAAAQAAsAAAUvICCOZGme5ERRk6iy7qpyHCVStA3gNa/7txxwlwv2isSacYUc+l4tADQGQ1mvpBAAIfkECQsAAAAsAAAAABAACwAABS8gII5kaZ7kRFGTqLLuqnIcJVK0DeA1r/u3HHCXC/aKxJpxhRz6Xi0ANAZDWa+kEAA7AAAAAAAAAAAA)'
				});
				
				// add the spinner to the cover, and the cover to the element
				lib.append(fade, spin);
				lib.append(el, fade);
				
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
	window['loading'].plugin('fb', module);
}


if (typeof define === 'function' && define.amd) {
	define('loading.anim.fb', [], module);
} else {
	window.loader.plugin('fb', module);
}

})( window );
