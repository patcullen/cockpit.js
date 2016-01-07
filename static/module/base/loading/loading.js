/*	A module for presenting a simple animation to indicate a resource is loading on your webpage.
 *		This module can accept animation plugins that may offer more attractive or specialized
 *		animations.
 *
 *	A simple example:
 *		require(['js/loading'], function(laoding) {
 *			var anim = loading.start(someElement);
 *			// do some work here
 *			anim.stop();
 *		});
 */
(function(window){

var module = (function(){

	var 
		document = window.document,
		defaultElement,
		defaultStop,
		defaultPlugin = 'default',
		currentlyAnimating = [],
		plugin = {},
		
	/* Abstracted any operations to do with the DOM into a library object. This way I can more easily 
	 *		create streamlined versions of the loading.js library for different javascript libraries.
	 *		To name a few that are planned: JQuery, Mootools, Prototype, YUI, Dojo, ExtJS
	 *		A streamlined version of loading.js that has been compiled for one of the above mentioned
	 *		js libraries will undoubtedly be smaller as it will leverage off of their DOM manipulation
	 *		and animation functions.
	 */
	 
	/* This particular library depends on no external JS library. */
	library = {
		/* Return a single named style from an element.
		 *
		 * Thank you Christian C. Salvadó... From: https://gist.github.com/cms/369133
		 */
		getStyle: function(el, styleProp) {
			var value, defaultView = el.ownerDocument.defaultView;
			// W3C standard way:
			if (defaultView && defaultView.getComputedStyle) {
				// sanitize property name to css notation (hypen separated words eg. font-Size)
				styleProp = styleProp.replace(/([A-Z])/g, '-$1').toLowerCase();
				return defaultView.getComputedStyle(el, null).getPropertyValue(styleProp);
			} else if (el.currentStyle) { // IE
				// sanitize property name to camelCase
				styleProp = styleProp.replace(/\-(\w)/g, function(str, letter) {
					return letter.toUpperCase();
				});
				value = el.currentStyle[styleProp];
				// convert other units to pixels on IE
				if (/^\d+(em|pt|%|ex)?$/i.test(value)) { 
					return (function(value) {
						var oldLeft = el.style.left, oldRsLeft = el.runtimeStyle.left;
						el.runtimeStyle.left = el.currentStyle.left;
						el.style.left = value || 0;
						value = el.style.pixelLeft + 'px';
						el.style.left = oldLeft;
						el.runtimeStyle.left = oldRsLeft;
						return value;
					})(value);
				}
				return value;
			}
		},
		
		/* Set a single named style on an alement.
		 */
		setStyle: function(el, style, value) {
			el.style[style] = value;
		},

		/* Set a set of named styles on an element.
		 */
		setStyles: function(el, styles) {
			for (var key in styles)
				if (styles.hasOwnProperty(key))
					library.setStyle(el, key, styles[key]);
		},
		
		/* create a DOM element.
		 */
		createElement: function(tag) {
			return document.createElement('div');
		},
		
		/* create a DOM element.
		 */
		append: function(parent, child) {
			return parent.appendChild(child);
		},
		
		/* remove a DOM element from a parent.
		 */
		remove: function(parent, child) {
			return parent.removeChild(child);
		},
		
		/* Will try to use the native JS indexOf if it exists, or it will use a substitute. (for IE8 and down)
		 */
		indexOf: function(array, needle) {
			if(typeof Array.prototype.indexOf === 'function') {
				return array.indexOf(needle);
			} else {
				var i = -1, index = -1;
				for(i = 0; i < array.length; i++) {
					if(array[i] === needle) {
						index = i;
						break;
					}
				}
				return index;
			}
		}

		
	},
	
	/* For registering a plugin animation in the module registry. once a plugin code is loaded once, from 
	 * 		then on it may be referenced simply by its name.
	 *	eg:	
	 *		loading.set({ 
	 *			plugin: { 
	 *				name: 'spin',
	 *				worker: pluginObject
	 *			}
	 *		});
	 *		var stop1 = loading.start(element1), // will show the spin animation on element 1
	 *			stop2 = loading.start(element2); // will show the spin animation on element 2
	 */
	registerPlugin = function(p1, p2) {
		var p = p2 ? { name: p1, worker: p2 } : p1;
		if (typeof p == 'object') {
			if (p.name) {
				plugin[p.name] = p.worker(library)
				return name;
			}
		} else {
			if (typeof p == 'function') {
				plugin['default'] = p(library);
				return 'default';
			}
		}
		return false;
	},
	
	/* For registering a plugin to operate with. If only a worker is provided, it becomes the default 
	 *		plugin. This method buffers the one above it so that we may still return "this" when
	 * 		calling it externally via the api returned by constructor.
	 */
	loadPlugin = function(p1, p2) {
		registerPlugin(p1, p2);
		return this; // to aid compound inline statements. saving wasted scrolls, saving lines of code.
	},
	
	/* Check if a plugin has been specified in the options object. Plugins may be specified through in the
	 * following formats:
	 *		loading.start({ element: someElement, plugin: 'spin' });
	 *		loading.start({ element: someElement, plugin: { name: 'spin', worker: pluginObject } });
	 *		loading.start(someElement, 'spin');
	 *		loading.start(someElement, { name: 'spin', worker: pluginObject });
	 */
	detectPlugin = function(ops) {
		if (ops.plugin) {
			if (typeof ops.plugin == 'string')
				return (plugin[ops.plugin] ? ops.plugin : 'default');
			else
				if (typeof ops.plugin == 'object')
					return registerPlugin(ops);
			console.log('Error while detecting specified plugin - Using default plugin.');
		}
		return false;
	},
	
	/*
	 *
	 *
	 */
	isAnimatingElement = function(el) {
		return 1;
	},
	
	/* For providing default values for an element to operate on, and/or a plugin to operate with.
	 */
	set = function(ops, pluginOps) {
		/* has a default element been specified for this module? 
		 *		(perhaps someone will only want to use this module on one element on the page. in this 
		 *		case the code might be more pretty if they don't have to pass in element references 
		 *		all the time)
		 */
		if (ops) defaultElement = (ops.element ? ops.element : ops);
		
		/* Try to detect a default plugin */
		defaultPlugin = detectPlugin(pluginOps ? pluginOps : ops);
		if (!defaultPlugin) defaultPlugin = 'default';
		
		return this; // to aid compound inline statements. saving wasted scrolls, saving lines of code.
	},
	
	/* When this start function 
	 *		is called, it should in turn provide it's own stop function, that is able to stop the
	 *		animation generated by the corresponding start(). This is to allow multiple loadings
	 *		being run simultaneaously on the page.	
	 */
	start = function(ops, pluginOps) {
		var 
			// detect if a plugin was specified
			specifiedPlugin = detectPlugin(pluginOps ? pluginOps : ops),
			// either use specified plugin from above, or just use the default one
			selectedPlugin = plugin[specifiedPlugin ? specifiedPlugin : defaultPlugin],
			// thte element to operate on
			el = (ops.element ? ops.element : ops),
			// what shall we return to the implementor
			result;
		
		if (library.indexOf(currentlyAnimating, el) > -1)
			// if we're already animating the selected element, then we don't want to push it through a 
			//		plugin/worker again,. rather just rreturn the result from the first time.
			//result = selectedPlugin.start(ops);
			console.log('not again!');
		else
			// run the options through the plugin
			result = selectedPlugin.start(ops);
		// assign the default stop to the latest stop generated. (so we can use the module ".stop" function 
		//		to stop what we might be able to assume is the latest right stop - might look nice in 
		//		some code, in some situations.)
		defaultStop = result.stop;
		// return this result / stop function to the calling code
		return result;
	},
	
	/* the default stop method of the module. i don't really encourage use of this one, but it's still here 
	 *		incase it can be of good use or help make someones implementing code look pretty.
	 */
	stop = function(ops) {
		if (defaultStop) return defaultStop(ops);
	}

	/* A default plugin for the base module.
	 *		A boring loading animation that actually does nothing except hover three dots in the center
	 *		of the element. This is default as it's the smallest possible blocking element/animation I
	 *		could think of. Will probably always use a thrid-party animation with a nice rolly-polly
	 *		animation, or a streamlined build that includes one as the default.
	 */
	plugin['default'] = (function(lib) {
		return {
			start: function(el, ops) {
				var 
					// setup elements
					fade = lib.createElement('div'),
					
					// setup a stop function
					stop = function() {
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
					'backgroundColor': 'rgba(150,150,150,0.3)',
					'textAlign': 'center',		// center horiz
					'boxSizing': 'border-box',	// center vert
					'paddingTop': '25%',		// center vert
					'z-index': 10000
				});

				// add ellipsis to cover (simplist default plugin I could think of...)
				fade.innerText = '...';

				// add the cover to the element
				lib.append(el, fade);

				// return stop function
				return {
					stop: function() { setTimeout(stop, 20); }
				};
			}
		};
	})(library);
	
	
	constructor = function() {
		
		/* Return a standard object that always provides a start() function.
		 */
		return {
			set: set,
			plugin: loadPlugin,
			start: start,
			stop: stop
		};
	};
	
	// use the constructor defined above to wrap the logic of setting up this module. return the result of constructor()
	return constructor;
	
})();


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
	window['loading'] = module;
}

if (typeof define === 'function' && define.amd) {
	define('loading', [], module);
} else {
	window.loader = module;
}

})( window );
