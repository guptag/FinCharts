var _ = require("lodash"),
    PriceLabels = require("../labels/pricelabels"),
    DateTimeLabels = require("../labels/datetimelabels");

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

    var dateTimeLabels = DateTimeLabels.generate(options.data, "daily", this.canvasWidth);
    console.log(dateTimeLabels);

    this.xUnitScale = this.canvasWidth / options.data.series.length;
    this.yUnitScale = this.canvasHeight / (this.extendedMax - this.extendedMin);
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
    priceLabels.shift(); //remove first price item which aligns on x-axis
    this.xAxisTicks =   _.map(priceLabels, function(price) {
                            var path = [];
                            path.push("M" + self.margin.left + "," + self.toPlotY(price));
                            path.push("L" + (self.margin.left + self.canvasWidth + Math.floor(self.canvasWidth * 0.5/100) /* ext for label */) + "," + self.toPlotY(price)); //x-axis tick
                            return {
                                pathStr : path.join(""),
                                stroke : "#bdbdc1",
                                label : {
                                    x: self.margin.left + self.canvasWidth + Math.floor(self.canvasWidth * 0.65/100),
                                    y: self.toPlotY(price) + 3.35,
                                    text: +price.toFixed(3)
                                }
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
    this.yAxisTicks =  _.chain(dateTimeLabels)
                        .map(function(labelItem) {
                            var dataIndex = labelItem.dataItemIndex;

                            var path = [];
                            path.push("M" + self.toPlotX(dataIndex) + "," + self.margin.top);
                            path.push("L" + self.toPlotX(dataIndex) + "," + (self.margin.top + self.canvasHeight + Math.floor(self.canvasHeight * 1/100) /* ext for label */)); //y-axis tick

                            var labelPullBack;
                            switch (labelItem.label.length) {
                                case 4: labelPullBack = 14; break;
                                case 3: labelPullBack = 10; break;
                                case 2: labelPullBack = 7; break;
                                case 1: labelPullBack = 2; break;
                            };

                            return {
                                pathStr : path.join(""),
                                stroke : "#bdbdc1",
                                label : {
                                    x: self.toPlotX(dataIndex) - labelPullBack /* based of length of chars */,
                                    y: self.margin.top + self.canvasHeight + Math.floor(self.canvasHeight * 2.75/100),
                                    text: labelItem.label
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
    return formatNumber(this.margin.top + this.canvasHeight  - ((dataY - this.extendedMin) * this.yUnitScale));
}

function formatNumber(number) {
    return +number.toFixed(3);
}

module.exports = AxisSeriesModel;
