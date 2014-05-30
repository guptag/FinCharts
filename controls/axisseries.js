var _ = require("lodash");

function AxisSeriesModel(options) {
    /* {
            width: plot width
            height: plot height
            data: price data (raw)
       }
    */
    var self = this;
    this.options = options;

     // Stretch the min and max by certain amounts to give enough space at the top and bottom of the price plot
    this.extendedMin = options.data.series.min - (2.5 * (options.data.series.min) / 100);
    this.extendedMax = options.data.series.max + (1 * (options.data.series.max) / 100);

    this.xUnitScale = options.width / options.data.series.length;
    this.yUnitScale = (this.extendedMax - this.extendedMin)/options.height;
    this.tickMargin = (this.xUnitScale/2);


    //console.log(options.data.series.max, options.data.series.min, options.height, this.yUnitScale);

    // x-axis bar
    var path = [];
    path.push("M" + "0" + "," + options.height);
    path.push("L" + options.width + "," + options.height);
    this.xAxis = {
                    pathStr : path.join(""),
                    stroke: "black"
                };

    // x-axis ticks (represents price)
    var yTickCount = 10;
    var priceRatio = (this.extendedMax - this.extendedMin)/ yTickCount;
    this.xAxisTicks = _.times(yTickCount, function(index) {

                            var path = [];
                            path.push("M" + "0" + "," + self.toPlotY(self.extendedMin + priceRatio * (index + 1)));
                            path.push("L" + options.width + "," + self.toPlotY(self.extendedMin + priceRatio * (index + 1))); //y-axis tick

                            return {
                                pathStr : path.join(""),
                                stroke : "#bdbdc1"
                            }
                        });


    // y-axis bar
    var path = [];
    path.push("M" + options.width + "," + options.height);
    path.push("L" + options.width + "," + "0");
    this.yAxis = {
                    pathStr : path.join(""),
                    stroke: "black"
                };

    // each tick represents a day (in daily chart)
    this.yAxisTicks = _.chain(options.data.series)
                        .map(function(data, index) {
                            // show one for every 5 data points
                            if (index % 5 === 0) {
                                var path = [];
                                path.push("M" + self.toPlotX(index) + "," + options.height);
                                path.push("L" + self.toPlotX(index) + "," + "0"); //y-axis tick

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
    return formatNumber(this.xUnitScale * dataX + this.tickMargin);
}

AxisSeriesModel.prototype.toPlotY = function (dataY) {
    return formatNumber(this.options.height - ((dataY - this.extendedMin) / this.yUnitScale))
}

function formatNumber(number) {
    return +number.toFixed(3);
}

module.exports = AxisSeriesModel;