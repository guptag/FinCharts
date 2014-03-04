
var liveReload = new function () {

	var gaze = require('gaze');
	
	this.watch = function () {
		gaze(['lib/*.js', 'index.html', 'index.css', 'index.js'], function () {
			console.log(this.watched());
			console.log(this);
			this.on('all', function(event, filepath) {
			 	console.log(filepath, event);
			 	window.location = "index.html";
			});
		});
		
	};
}

module.exports = liveReload;
