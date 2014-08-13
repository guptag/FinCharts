var PlotSeries = require('./candlestickseries'),
	VolumeSeries = require('./volumeseries'),
	AxisSeries =require('./axisseries'),
	CrossHairSeries =require('./crosshairseries'),
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

	var crossHairSeries = new CrossHairSeries({
		width: options.width,
		height: options.height,
		data: options.data,
		margin: {top: 0, bottom: Math.floor(options.height * 4.2/100), left: 0, right: Math.floor(options.width * 2.5/100)}
	});
	this.crossHairSeries = crossHairSeries;

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


	// y-axis line
	var yAxisGroup = s.group().attr("class", "y-axis");
	var path = s.path(axisSeries.yAxis.pathStr)
					 .attr({
					 	stroke: axisSeries.yAxis.stroke,
					 	"stroke-width": "1" });
	yAxisGroup.add(path);

	// date bars
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

	// volume bars
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


	// candles
	var candlesGroup = s.group().attr("class", "candles");
	_.forEach(p.candles, function(candle) {
		var path = s.path(candle.pathStr)
					 .attr({
					 	fill: candle.fill,
					 	stroke: candle.stroke,
					 	"stroke-width": "1" });
		candlesGroup.add(path);
	});

	// crosshair

	var crossHairGroup = s.group().attr("class", "crosshair");

	this.crossHairRect = s.rect(0,0, options.width, options.height)
												.attr("class", "crosshair-rect");
	this.crossHairRect.mousemove(_.bind(this.onMouseMove, this));

	this.crossHairX = s.path(crossHairSeries.xAxis.pathStr)
					 .attr({
					 	stroke: crossHairSeries.xAxis.stroke,
					 	"stroke-dasharray": crossHairSeries.xAxis["stroke-dasharray"] });
	this.crossHairX.transform(crossHairSeries.xAxis.transformStr);

	this.crossHairY = s.path(crossHairSeries.yAxis.pathStr)
					 .attr({
					 	stroke: crossHairSeries.yAxis.stroke,
					 	"stroke-dasharray": crossHairSeries.yAxis["stroke-dasharray"] });
	this.crossHairY.transform(crossHairSeries.yAxis.transformStr);

	crossHairGroup.add(this.crossHairX);
	crossHairGroup.add(this.crossHairY);
	crossHairGroup.add(this.crossHairRect);
}

CandleStickChart.prototype.onMouseMove = _.throttle(function (ev) {
	console.log(ev.offsetX, ev.offsetY);
	this.crossHairSeries.updateTransform(ev.offsetX, ev.offsetY);

	this.crossHairX.transform(this.crossHairSeries.xAxis.transformStr);
	this.crossHairY.transform(this.crossHairSeries.yAxis.transformStr);
}, 75);

module.exports = CandleStickChart;
