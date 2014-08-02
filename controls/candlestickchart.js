var PlotSeries = require('./candlestickseries'),
	VolumeSeries = require('./volumeseries'),
	AxisSeries =require('./axisseries'),
	Q = require('q'),
	_ = require('lodash');

var CandleStickChart = function (options) {
	/*
		data: raw prcing data
		selector: svg selector,
		width : width of the svg
		height: height of the svg
		Snap: reference to Snap object (todo change to require)
	*/
	var p = new PlotSeries({
		width: options.width,
		height: options.height,
		data: options.data,
		margin: {top: 5, bottom: Math.floor(options.height * 4/100), left: 2, right: Math.floor(options.width * 2.5/100)}
	});

	var vol = new VolumeSeries({
		width: options.width,
		height: options.height,
		data: options.data,
		margin: {top: 5, bottom: Math.floor(options.height * 4/100), left: 2, right: Math.floor(options.width * 2.5/100)}
	});

	var axisSeries = new AxisSeries({
		width: options.width,
		height: options.height,
		data: options.data,
		margin: {top: 5, bottom: Math.floor(options.height * 4/100), left: 2, right: Math.floor(options.width * 2.5/100)}
	});

	var s = options.Snap(options.selector).attr({
		width: options.width,
		height: options.height,
	});

	s.clear();

	var chartTitleGroup = s.group().attr("class", "title");
	var tickerText = s.text(options.width/2 - 100, options.height/2, options.data.ticker);
	chartTitleGroup.add(tickerText);


	// x-axis line
	var xAxisGroup = s.group().attr("class", "x-axis");
	var path = s.path(axisSeries.xAxis.pathStr)
					 .attr({
					 	stroke: axisSeries.xAxis.stroke,
					 	"stroke-width": "1" });
	xAxisGroup.add(path);
	// price bars
	_.forEach(axisSeries.xAxisTicks, function(tick) {
		var path = s.path(tick.pathStr)
					 .attr({
					 	stroke: tick.stroke,
					 	"stroke-width": "1" });
		var label = s.text(tick.label.x, tick.label.y, tick.label.text)
								.attr("class", "pricelabel");
		xAxisGroup.add(path);
		xAxisGroup.add(label);
	});


	// date
	var yAxisGroup = s.group().attr("class", "y-axis");
	var path = s.path(axisSeries.yAxis.pathStr)
					 .attr({
					 	stroke: axisSeries.yAxis.stroke,
					 	"stroke-width": "1" });
	yAxisGroup.add(path);
	_.forEach(axisSeries.yAxisTicks, function(tick) {
		var path = s.path(tick.pathStr)
					 .attr({
					 	stroke: tick.stroke,
					 	"stroke-width": "1" });
	  var label = s.text(tick.label.x, tick.label.y, tick.label.text)
				.attr("class", "datetimelabel");
		yAxisGroup.add(path);
		yAxisGroup.add(label);
	});

	var volumeGroup = s.group().attr("class", "volume");
	_.forEach(vol.bars, function(bar) {
		var path = s.path(bar.pathStr)
					 .attr({
					 	fill: bar.fill,
					 	stroke: bar.stroke,
					 	"stroke-width": "1",
					 	"opacity" : 0.25 });
		volumeGroup.add(path);
	});


	var candlesGroup = s.group().attr("class", "candles");
	_.forEach(p.candles, function(candle) {
		var path = s.path(candle.pathStr)
					 .attr({
					 	fill: candle.fill,
					 	stroke: candle.stroke,
					 	"stroke-width": "1" });
		candlesGroup.add(path);
	});



}

module.exports = CandleStickChart;
