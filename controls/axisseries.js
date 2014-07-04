var _ = require("lodash"),
    PriceLabels = require("../labels/pricelabels");;

function AxisSeriesModel(options) {
    /* {
            width: plot width
            height: plot height
            data: price data (raw)
       }
    */
    var self = this;
    this.options = options;

    this.margin = _.defaults(options.margin, {left: 0, right: 0, top: 0, bottom: 0});
    this.canvasWidth = options.width - this.margin.left - this.margin.right;
    this.canvasHeight = options.height - this.margin.top - this.margin.bottom;

    // Stretch the min and max by certain amounts to give enough space at the top and bottom of the price plot
    var priceLabels = PriceLabels.generate(options.data.series.min, options.data.series.max, this.canvasHeight);
    this.extendedMin = priceLabels[0];
    this.extendedMax = priceLabels[priceLabels.length - 1];

    this.xUnitScale = this.canvasWidth / options.data.series.length;
    this.yUnitScale = (this.extendedMax - this.extendedMin)/this.canvasHeight;
    this.tickMargin = (this.xUnitScale/2);

    console.log("AxisSeriesModel: y-scale", this.yUnitScale, this.extendedMin);


    //console.log(options.data.series.max, options.data.series.min, options.height, this.yUnitScale);

    // X-axis bar
    var path = [];
    path.push("M" + "0" + "," + (this.margin.top + this.canvasHeight));
    path.push("L" + options.width + "," + (this.margin.top + this.canvasHeight));
    this.xAxis = {
                    pathStr : path.join(""),
                    stroke: "black"
                };

    // X-axis ticks (represents price)
    var yTickCount = priceLabels.length;
    var priceRatio = (this.extendedMax - this.extendedMin)/ yTickCount;
    this.xAxisTicks = _.times(yTickCount, function(index) {
                            var path = [];
                            path.push("M" + self.margin.left + "," + self.toPlotY(self.extendedMin + (priceRatio * index)));
                            path.push("L" + (self.margin.left + self.canvasWidth + 8 /* ext for label */) + "," + self.toPlotY(self.extendedMin + (priceRatio * index))); //x-axis tick

                            return {
                                pathStr : path.join(""),
                                stroke : "red"
                            }
                        });


    // Y-axis bar
    var path = [];
    path.push("M" + (this.margin.left + this.canvasWidth) + "," + options.height); //only place to use options.height
    path.push("L" + (this.margin.left + this.canvasWidth) + "," + "0");
    this.yAxis = {
                    pathStr : path.join(""),
                    stroke: "black"
                };

    // each tick represents a day (in daily chart)
    this.yAxisTicks =  _.chain(options.data.series)
                        .map(function(data, index) {
                            // show one for every 5 data points
                            if (index % 5 === 0) {
                                var path = [];
                                path.push("M" + self.toPlotX(index) + "," + self.margin.top);
                                path.push("L" + self.toPlotX(index) + "," + (self.margin.top + self.canvasHeight + 8 /* ext for label */)); //y-axis tick

                                return {
                                    pathStr : path.join(""),
                                    stroke : "#bdbdc1"
                                }
                            }
                        })
                        .compact()
                        .value();
    }


AxisSeriesModel.prototype.toPlotX = function (dataX) {
    return formatNumber(this.margin.left + (this.xUnitScale * dataX + this.tickMargin));
}

AxisSeriesModel.prototype.toPlotY = function (dataY) {
    return formatNumber(this.margin.top + this.canvasHeight  - ((dataY - this.extendedMin) / this.yUnitScale));
}

function formatNumber(number) {
    return +number.toFixed(3);
}

module.exports = AxisSeriesModel;