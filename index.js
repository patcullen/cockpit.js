
'use strict';

module.exports = function(schema) {
  var express = require('express');
  var app = express();
  var http = require('http').Server(app);
  var io = require('socket.io')(http);
  var html = 'not loaded yet';
  var uuidCounter = 0, eventResult = {};

  // setup client front page html
  require('fs').readFile(__dirname + '/static/index.html', 'utf8', function(err, text) {
    var schemaForClient = JSON.parse(JSON.stringify(schema, function(key, val) {
      return (typeof val === 'function') ? '' + val : val;
    }));
    // prepare a more secret version of the schema for delivery to the client
    for (var i = 0; i < schemaForClient.elements.length; i++) {
      var s = schemaForClient.elements[i].server;
      if (typeof s === 'undefined' || s == null) continue;
      for (var ev in s)
        if (s.hasOwnProperty(ev))
          s[ev] = true;
    }
    html = text.replace('{{schema}}', JSON.stringify(schemaForClient));
    html = html.replace('{{theme}}', schema.theme ? schema.theme : '');
  });

  // routes
  app.get('/', function (req, res) {
    res.send(html);
  });
  app.use(express.static(__dirname + '/static'));
  app.use(express.static(__dirname + '/node_modules'));

  io.on('connection', function(socket) {

    socket.on('event', function(data) {
  //    console.log('event');
  //    console.dir(data);
      for (var i = 0; i < schema.elements.length; i++) {
        var el = schema.elements[i];
        if (el.name && el.name == data.element) {
          var ev = el.server[data.event];
          if (ev)
            ev(el, data.data, io, call);
          break;
        }
      }
    });

    socket.on('callResult', function(data) {
      eventResult['_' + data.id](data.result);
      delete eventResult['_' + data.id];
    });

    socket.on('error', function(data) {
      console.error(data.msg);
      console.log('Data that generated error:');
      console.dir(data.data);
    });

    socket.on('disconnect', function() {
      console.log('user disconnected');
    });

  });

  function call(element, method, params, callback) {
    if (typeof callback === 'function') {
      var id = uuidCounter++;
      io.emit('call', { id: id, element: element, method: method, params: params, wantResult: true });
      eventResult['_' + id] = callback;
    } else {
      io.emit('call', { element: element, method: method, params: params, wantResult: false });
    }
  }

  http.listen(schema.port, function() {
    console.log('> cockpit.js is listening on *:' + schema.port);
  });

};
