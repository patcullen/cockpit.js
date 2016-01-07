define(function(){
	var
		$ = require('jquery'),
		margin = 0.6 // margin in vmin around the element for easier schema defining.
	;

	var applyCommonOptions = function(e, o, io) {

		e.setColor = function(c) {
			if (!e.hasClass('color'))
				e.addClass('color');
			e.css('background-color', c);
		};

		e.setFontColor = function(c) {
			e.css('color', c);
		};

		e.setText = function(t) {
			if (e.find('.text').length == 0)
				e.append($('<span class="text"></span>'), $('<span class="text under"></span>'));
			e.find('.text').text(t);
		};

		if (typeof o.x === 'number') e.css('left', (o.x+margin) + 'vmin');
		if (typeof o.y === 'number') e.css('top', (o.y+margin) + 'vmin');
		if (o.w) e.css('width', (o.w-margin*2) + 'vmin');
		if (o.h) e.css('height', (o.h-margin*2) + 'vmin');
		if (o.color) e.setColor(o.color);
		if (o.fontColor) e.setFontColor(o.fontColor);
		if (o.align) e.css('text-align', o.align);
		if (o.valign) e.css('vertical-align', o.valign);



		if (o.text) {
			e.setText(o.text);
		}

		// attach hooks to send server events from schema
		if (o.server) {
			for (var ev in o.server)
				if (o.server.hasOwnProperty(ev) && o.name) {
          (function(_e, _ev, _o) {
            _e.on(_ev, function(event) {
              // dont send these things. (cant foresee needing them and no point sending bits we don't need)
              if (event.currentTarget) delete event.currentTarget;
              if (event.delegateTarget) delete event.delegateTarget;
              if (event.view) delete event.view;
              if (event.handleObj) delete event.handleObj;
              if (event.srcElement) delete event.srcElement;
							// do try send a value if the element has one
							event.value = (typeof _e.val === 'function' ? _e.val() : (typeof _e.text === 'function' ? _e.text() : null));
							//console.log('sending event:', event);

              io.emit('event', { element: _o.name, event: _ev, data: JSON.decycle(event) });
            });
          })(e, ev, o);
				}
		}

		// attach client events from schema
		if (o.client) {
			for (var ev in o.client)
				if (o.client.hasOwnProperty(ev))
					e.on(ev, eval('(' + o.client[ev] + ')').bind(e, o, io));
		}

    e.remoteCall = function(method, params, cb) {
			cb(e[method].apply(e, params));
		};

	};

	return {
    applyCommonOptions: applyCommonOptions,
    margin: margin
  };

});

// Courtest of DC @ https://github.com/douglascrockford/JSON-js/blob/master/cycle.js
"function"!=typeof JSON.decycle&&(JSON.decycle=function(e){"use strict";var t=[],r=[];return function n(e,a){var o,i,f;if(!("object"!=typeof e||null===e||e instanceof Boolean||e instanceof Date||e instanceof Number||e instanceof RegExp||e instanceof String)){for(o=0;o<t.length;o+=1)if(t[o]===e)return{$ref:r[o]};if(t.push(e),r.push(a),"[object Array]"===Object.prototype.toString.apply(e))for(f=[],o=0;o<e.length;o+=1)f[o]=n(e[o],a+"["+o+"]");else{f={};for(i in e)Object.prototype.hasOwnProperty.call(e,i)&&(f[i]=n(e[i],a+"["+JSON.stringify(i)+"]"))}return f}return e}(e,"$")}),"function"!=typeof JSON.retrocycle&&(JSON.retrocycle=function retrocycle($){"use strict";var px=/^\$(?:\[(?:\d+|\"(?:[^\\\"\u0000-\u001f]|\\([\\\"\/bfnrt]|u[0-9a-zA-Z]{4}))*\")\])*$/;return function rez(value){var i,item,name,path;if(value&&"object"==typeof value)if("[object Array]"===Object.prototype.toString.apply(value))for(i=0;i<value.length;i+=1)item=value[i],item&&"object"==typeof item&&(path=item.$ref,"string"==typeof path&&px.test(path)?value[i]=eval(path):rez(item));else for(name in value)"object"==typeof value[name]&&(item=value[name],item&&(path=item.$ref,"string"==typeof path&&px.test(path)?value[name]=eval(path):rez(item)))}($),$});
