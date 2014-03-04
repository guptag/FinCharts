var _ = require("lodash");

function PlotModel(options) {
	/* {
			width: plot width
			height: plot height
			data: price data (raw)
	   }
	*/
	var self = this;
	this.options = options;

	this.xUnitScale = formatNumber(options.width / options.data.series.length);
	this.yUnitScale = formatNumber((options.data.series.max - options.data.series.min)/options.height);
	this.candleWidth = formatNumber(this.xUnitScale * 70/100.0);

    this.candles = _.chain(options.data.series)
    				.map(function(data, index) {

    					if (data.open > data.close) {
    						data.above = data.open;
    						data.below = data.close;
    					} else {
    						data.below = data.open;
    						data.above = data.close;
    					}

    					var path = [];

    					path.push("M" + self.toPlotX(index) + "," + self.toPlotY(data.above));
    					path.push("L" + (self.toPlotX(index) + self.candleWidth) + "," + self.toPlotY(data.above)); //top edge
    					path.push("L" + (self.toPlotX(index) + self.candleWidth) + "," + self.toPlotY(data.below)); //right edge
    					path.push("L" + self.toPlotX(index) + "," + self.toPlotY(data.below)); //bottom edge
    					path.push("L" + self.toPlotX(index) + "," + self.toPlotY(data.above)); //left edge
    					path.push("M" + (self.toPlotX(index) + self.candleWidth/2) + "," + self.toPlotY(data.high)); //top whisker
    					path.push("L" + (self.toPlotX(index) + self.candleWidth/2) + "," + self.toPlotY(data.above));
    					path.push("M" + (self.toPlotX(index) + self.candleWidth/2) + "," + self.toPlotY(data.below)); //bottom whisker
    					path.push("L" + (self.toPlotX(index) + self.candleWidth/2) + "," + self.toPlotY(data.low));

    					return {
    						pathStr : path.join(""),
    						fill : data.open > data.close ? "#D14836" : "#46B771", //"#2F7ED8"
    						stroke: "black"
    					}
    				})
					.value();
}


PlotModel.prototype.toPlotX = function (dataX) {
	return formatNumber(this.xUnitScale * dataX);
}

PlotModel.prototype.toPlotY = function (dataY) {
	return formatNumber(this.options.height - ((dataY - this.options.data.series.min) / this.yUnitScale))
}

function formatNumber(number) {
    return +number.toFixed(2);
}

module.exports = PlotModel;

