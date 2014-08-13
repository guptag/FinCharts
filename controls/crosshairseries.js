var _ = require("lodash"),
    PriceLabels = require("../labels/pricelabels"),
    DateTimeLabels = require("../labels/datetimelabels");

function CrossHairSeries(options) {
    this.margin = _.defaults(options.margin, {left: 0, right: 0, top: 0, bottom: 0});
    this.canvasWidth = options.width - this.margin.left - this.margin.right;
    this.canvasHeight = options.height - this.margin.top - this.margin.bottom;

    // X-axis cross-hair
    var path = [];
    path.push("M" + "0" + "," + 0);
    path.push("L" + this.canvasWidth + "," + 0);
    this.xAxis = {
                    pathStr : path.join(""),
                    stroke: "black",
                    transformStr: "T0,0",
                    "stroke-dasharray":"3, 3",
                };

    // y-axis cross-hair
    var path = [];
    path.push("M" + 0 + "," + this.canvasHeight);
    path.push("L" + 0 + "," + "0");
    this.yAxis = {
                    pathStr : path.join(""),
                    stroke: "black",
                    "stroke-dasharray":"3, 3",
                    transformStr: "T0,0"
                };
}

CrossHairSeries.prototype.updateTransform = function (mouseX, mouseY) {
    this.xAxis.transformStr = "T0," + mouseY;
    this.yAxis.transformStr = "T" + mouseX + ",0";
}

CrossHairSeries.prototype.toPlotX = function (dataX) {
    return formatNumber(this.margin.left + (this.xUnitScale * dataX) + this.candleLeftMargin);
}

CrossHairSeries.prototype.toPlotY = function (dataY) {
    return formatNumber(this.margin.top + this.canvasHeight - ((dataY - this.extendedMin) / this.yUnitScale));
}

function formatNumber(number) {
    return +number.toFixed(3);
}

module.exports = CrossHairSeries;
