window.cockpit = (function() {

	var registry = {},
			nameId = 0;

	function loadCss(url) {
		var link = document.createElement('link');
		link.type = 'text/css';
		link.rel = 'stylesheet';
		link.href = url;
		document.getElementsByTagName('head')[0].appendChild(link);
	}

	function create(schema, parent, io) {
		loadCss('module/'+schema.type+'/'+schema.type+'.css');
    require(['loading/loading'], function(loading) {
  		var animation = loading.start(parent.element[0]);
  		require(['module/'+schema.type+'/'+schema.type+'.js'], function(factory) {
				factory(schema, io, function(object) {
					parent.element.append(object.element);
					registry[schema.name || 'noname' + nameId++] = object;
					animation.stop();
	  			if (schema.elements)
	  				for (var i = 0; i < schema.elements.length; i++)
	  					create(schema.elements[i], object, io);
				});
  		});
    });
	};

	function loadSchema(schema, callback) {
		//console.log('load schema', schema);
		require(['/socket.io/socket.io.js'], function(socket) {
			var io = socket();

	    for (var i = 0; i < schema.elements.length; i++)
	      create(schema.elements[i], { element: $('#body') }, io);

			io.on('call', function(data) {
				var found = registry[data.element];
				//console.log('remoteCall: ', data, found);
				if (found && found.element) {
					registry[data.element].element.remoteCall(data.method, data.params, function(result) {
						if (data.wantResult)
							io.emit('callResult', { id: data.id, result: result });
					});
				} else {
					if (data.wantResult)
						io.emit('callResult', { id: data.id, result: null });
					io.emit('error', { msg: 'A remote call was issued to an unfound element. Make sure element name is correct.', data: data });
				}
			});

			if (callback) callback();
		});
	};

  	return {
    loadSchema: loadSchema
  };

})();
