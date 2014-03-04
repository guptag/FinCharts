var PlotSeries = require('../models/candlestickseries'),
	Q = require('q'),
	_ = require('lodash');

var CandleStickChart = function (options) {
	/*
		data: raw prcing data
		selector: svg selector,
		width : width of the svg
		height: height of the svg
		Snap: reference to Snap object (todo change to require)
		padding: {left:x, top:x, right:x, bottom:x}
	*/
	var p = new PlotSeries({
		width: options.width,
		height: options.height,
		data: options.data,
		padding: _.extend({left:10, right:10, top:10, bottom:10}, options.padding)
	});

	var s = options.Snap(options.selector).attr({
		width: options.width,
		height: options.height,
	});

	_.forEach(p.candles, function(candle) {
		s.path(candle.pathStr)
		 .attr({
		 	fill: candle.fill,
		 	stroke: candle.stroke,
		 	"stroke-width": "1" });
	});
}

module.exports = CandleStickChart;