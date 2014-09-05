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
		margin: {top: 5, bottom: 25, left: 2, right: 40}
	});

	var vol = new VolumeSeries({
		width: options.width,
		height: options.height,
		data: options.data,
		margin: {top: 5, bottom: 25, left: 2, right: 40}
	});

	var axisSeries = new AxisSeries({
		width: options.width,
		height: options.height,
		data: options.data,
		margin: {top: 5, bottom: 25, left: 2, right: 40}
	});

	var crossHairSeries = new CrossHairSeries({
		width: options.width,
		height: options.height,
		data: options.data,
		margin: {top: 5, bottom: 25, left: 2, right: 40},
		priceMin: p.extendedMin,
		priceMax: p.extendedMax
	});
	this.crossHairSeries = crossHairSeries;

	var s = options.Snap(options.selector)/*.attr({
		width: options.width,
		height: options.height,
	})*/;

	s.clear();


	var chartTitleGroup = s.group().attr("class", "title");
	var tickerText = s.text(options.width/2 - 250, options.height/2, options.data.ticker);
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

	//overlay
	this.crossHairRect = s.rect(0,0, options.width, options.height)
												.attr("class", "crosshair-rect");
	this.crossHairRect.mousemove(_.bind(this.onMouseMove, this));
	this.crossHairRect.mouseout(_.bind(this.onMouseOut, this));

	this.crossHairX = s.group().attr("class", "crosshairX");
	this.crossHairX.add(s.path(crossHairSeries.xAxisGroup.path.pathStr)
					 .attr({
					 	stroke: crossHairSeries.xAxisGroup.path.stroke,
					 	"stroke-dasharray": crossHairSeries.xAxisGroup.path["stroke-dasharray"] }));
	this.crossHairX.add(s.rect(crossHairSeries.xAxisGroup.rect.x,
														crossHairSeries.xAxisGroup.rect.y,
														crossHairSeries.xAxisGroup.rect.width,
														crossHairSeries.xAxisGroup.rect.height)
												.attr({
					 										fill: "#000"
					 							}));
	this.crossHairX.add(s.text(crossHairSeries.xAxisGroup.label.x,
														crossHairSeries.xAxisGroup.label.y,
														crossHairSeries.xAxisGroup.label.text)
												.attr({
					 										class: "pricelabel",
					 										fill: "#FFF"
					 							}));
	this.crossHairX.transform(crossHairSeries.xAxisGroup.path.transformStr);

	this.crossHairY = s.group().attr("class", "crosshairX");
	this.crossHairY.add(s.path(crossHairSeries.yAxisGroup.path.pathStr)
					 .attr({
					 	stroke: crossHairSeries.yAxisGroup.path.stroke,
					 	"stroke-dasharray": crossHairSeries.yAxisGroup.path["stroke-dasharray"] }));
	this.crossHairY.add(s.rect(crossHairSeries.yAxisGroup.rect.x,
														crossHairSeries.yAxisGroup.rect.y,
														crossHairSeries.yAxisGroup.rect.width,
														crossHairSeries.yAxisGroup.rect.height)
												.attr({
					 										fill: "#000"
					 							}));
	// [2] -> text element
	this.crossHairY.add(s.text(crossHairSeries.yAxisGroup.label.x,
														crossHairSeries.yAxisGroup.label.y,
														crossHairSeries.yAxisGroup.label.text)
												.attr({
					 										class: "datetimelabel",
					 										fill: "#FFF"
					 							}));
	this.crossHairY.transform(crossHairSeries.yAxisGroup.path.transformStr);

	crossHairGroup.add(this.crossHairX);
	crossHairGroup.add(this.crossHairY);
	crossHairGroup.add(this.crossHairRect);
}

CandleStickChart.prototype.onMouseMove = _.throttle(function (ev) {
	console.log(ev.offsetX, ev.offsetY);
	this.crossHairSeries.updateTransform(ev.offsetX, ev.offsetY);

	this.crossHairX.transform(this.crossHairSeries.xAxisGroup.path.transformStr);
	this.crossHairX[2].attr("text", this.crossHairSeries.xAxisGroup.label.text);

	this.crossHairY.transform(this.crossHairSeries.yAxisGroup.path.transformStr);
	this.crossHairY[2].attr("text", this.crossHairSeries.yAxisGroup.label.text);
}, 75);

CandleStickChart.prototype.onMouseOut = function (ev) {
	this.crossHairSeries.updateTransform(-200, -200);

	this.crossHairX.transform(this.crossHairSeries.xAxisGroup.path.transformStr);
	this.crossHairX[2].attr("text", this.crossHairSeries.xAxisGroup.label.text);

	this.crossHairY.transform(this.crossHairSeries.yAxisGroup.path.transformStr);
	this.crossHairY[2].attr("text", this.crossHairSeries.yAxisGroup.label.text);
};

module.exports = CandleStickChart;
